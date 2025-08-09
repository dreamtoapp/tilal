import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import { getCart, addItem, updateItemQuantityByProduct, removeItem, CartWithItems } from '@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions';
import { Product } from '@/types/databaseTypes';

// Types
interface CartItem {
  product: Product;
  quantity: number;
}

// State
let isSyncInProgress = false;

// Get Zustand cart
const getZustandCart = () => {
  console.log('🔍 DEBUG: getZustandCart called');
  const cart = useCartStore.getState().cart;
  console.log('📦 DEBUG: getZustandCart result:', Object.keys(cart).length, 'items');
  return cart;
};

// Get database cart
const getDatabaseCart = async () => {
  console.log('🔍 DEBUG: getDatabaseCart called');
  try {
    const cart = await getCart();
    console.log('🗄️ DEBUG: getDatabaseCart result:', cart?.items?.length || 0, 'items');
    return cart;
  } catch (error) {
    console.error('❌ DEBUG: getDatabaseCart error:', error);
    throw error;
  }
};

// Merge carts - use Zustand quantities
const mergeCartData = (zustandCart: Record<string, CartItem>, dbCart: CartWithItems | null): Record<string, CartItem> => {
  const mergedCart = { ...zustandCart };

  if (!dbCart?.items) return mergedCart;

  // Add database items not in Zustand
  dbCart.items.forEach((dbItem) => {
    const productId = dbItem.productId;
    if (!mergedCart[productId] && dbItem.product) {
      mergedCart[productId] = {
        product: dbItem.product,
        quantity: dbItem.quantity,
      };
    }
    // Keep Zustand quantity for existing items
  });

  return mergedCart;
};

// Convert database cart to Zustand format
const convertDatabaseToZustand = (dbCart: CartWithItems): Record<string, CartItem> => {
  const zustandCart: Record<string, CartItem> = {};

  if (!dbCart.items) return zustandCart;

  dbCart.items.forEach((item) => {
    if (item.product) {
      zustandCart[item.productId] = {
        product: item.product,
        quantity: item.quantity,
      };
    }
  });

  return zustandCart;
};

// Save merged cart to database
const saveMergedCartToDatabase = async (mergedCart: Record<string, CartItem>, dbCart: CartWithItems | null) => {
  if (dbCart?.items) {
    // Update existing items
    for (const [productId, item] of Object.entries(mergedCart)) {
      const dbItem = dbCart.items.find(i => i.productId === productId);

      if (dbItem) {
        await updateItemQuantityByProduct(productId, item.quantity - dbItem.quantity);
      } else {
        await addItem(productId, item.quantity);
      }
    }

    // Remove items not in merged cart
    for (const dbItem of dbCart.items) {
      if (!mergedCart[dbItem.productId]) {
        await removeItem(dbItem.id);
      }
    }
  } else {
    // Create new cart
    for (const [productId, item] of Object.entries(mergedCart)) {
      await addItem(productId, item.quantity);
    }
  }
};

// Update Zustand with database data
const updateZustandFromDatabase = async () => {
  const dbCart = await getDatabaseCart();
  if (dbCart) {
    const zustandCart = convertDatabaseToZustand(dbCart);
    useCartStore.getState().setCart(zustandCart);
  }
};

// Main sync function
export const syncCartOnLogin = async (): Promise<{ success: boolean; message: string; itemCount: number }> => {
  console.log('🚀 DEBUG: syncCartOnLogin function called');
  console.log('🔍 DEBUG: isSyncInProgress before check:', isSyncInProgress);

  if (isSyncInProgress) {
    console.log('⏳ DEBUG: Sync already in progress, skipping...');
    return { success: false, message: 'Sync already in progress', itemCount: 0 };
  }

  console.log('✅ DEBUG: Setting isSyncInProgress = true');
  isSyncInProgress = true;
  console.log('🔄 DEBUG: Starting cart sync on login...');

  try {
    console.log('🔍 DEBUG: Getting cart data...');
    // Get cart data
    const zustandCart = getZustandCart();
    console.log('📦 DEBUG: Zustand cart retrieved:', Object.keys(zustandCart).length, 'items');

    const dbCart = await getDatabaseCart();
    console.log('🗄️ DEBUG: Database cart retrieved:', dbCart?.items?.length || 0, 'items');

    console.log('📊 DEBUG: Cart data summary:', {
      zustandItems: Object.keys(zustandCart).length,
      dbItems: dbCart?.items?.length || 0,
      zustandCart: Object.keys(zustandCart),
      dbCartItems: dbCart?.items?.map(item => item.productId) || []
    });

    // Check if sync is actually needed
    const zustandItemCount = Object.keys(zustandCart).length;
    const dbItemCount = dbCart?.items?.length || 0;

    if (zustandItemCount === 0 && dbItemCount === 0) {
      console.log('✅ No items to sync, skipping...');
      return {
        success: true,
        message: 'لا توجد منتجات للمزامنة',
        itemCount: 0
      };
    }

    // Merge carts
    const mergedCart = mergeCartData(zustandCart, dbCart);
    console.log('🔗 Merged cart:', {
      mergedItems: Object.keys(mergedCart).length,
      mergedCart: Object.keys(mergedCart)
    });

    // Save to database first
    console.log('💾 Saving merged cart to database...');
    await saveMergedCartToDatabase(mergedCart, dbCart);

    // Update Zustand from database
    console.log('🔄 Updating Zustand from database...');
    await updateZustandFromDatabase();

    console.log('✅ Cart sync completed successfully');

    return {
      success: true,
      message: 'تم مزامنة السلة بنجاح',
      itemCount: Object.keys(mergedCart).length
    };

  } catch (error) {
    console.error('❌ Cart sync failed:', error);

    return {
      success: false,
      message: 'فشل في المزامنة، تم الاحتفاظ بالمنتجات الحالية',
      itemCount: 0
    };
  } finally {
    isSyncInProgress = false;
  }
};

// Update quantity with optimistic UI
export const updateQuantityOptimistically = async (
  productId: string,
  delta: number,
  isAuthenticated: boolean
): Promise<{ success: boolean; message?: string }> => {
  // Update UI immediately
  useCartStore.getState().updateQuantity(productId, delta);

  // Sync to database in background
  if (isAuthenticated) {
    try {
      await updateItemQuantityByProduct(productId, delta);
      return { success: true };
    } catch (error) {
      // Rollback on error
      useCartStore.getState().updateQuantity(productId, -delta);
      console.error('Quantity sync failed:', error);
      return {
        success: false,
        message: 'فشل في تحديث الكمية، تم التراجع عن التغيير'
      };
    }
  }

  return { success: true };
};

// Delete item with optimistic UI
export const deleteItemOptimistically = async (
  productId: string,
  itemId: string | null,
  isAuthenticated: boolean
): Promise<{ success: boolean; message?: string }> => {
  // Remove from UI immediately
  const deletedItem = useCartStore.getState().cart[productId];
  useCartStore.getState().removeItem(productId);

  // Sync to database in background
  if (isAuthenticated && itemId) {
    try {
      await removeItem(itemId);
      return { success: true };
    } catch (error) {
      // Restore on error
      if (deletedItem) {
        useCartStore.getState().addItem(deletedItem.product, deletedItem.quantity);
      }
      console.error('Delete sync failed:', error);
      return {
        success: false,
        message: 'فشل في حذف المنتج، تم إعادته إلى السلة'
      };
    }
  }

  return { success: true };
};

// Check if sync is running
export const isSyncRunning = (): boolean => {
  return isSyncInProgress;
};

// Get sync status for UI
export const getSyncStatus = () => {
  return {
    isRunning: isSyncInProgress,
    message: isSyncInProgress ? 'جاري مزامنة السلة...' : null,
  };
}; 