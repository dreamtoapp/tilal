import prisma from '@/lib/prisma';

/**
 * Fetches best-selling products by calculating salesCount from OrderItems
 * @param page - page number (default 1)
 * @param limit - items per page (default 12)
 * @returns { products, total }
 */
export async function getBestSellers({ page = 1, limit = 12 } = {}) {
  try {
    // Aggregate salesCount for each product
    const salesRaw = await prisma.orderItem.aggregateRaw({
      pipeline: [
        { $group: { _id: "$productId", salesCount: { $sum: "$quantity" } } },
        { $sort: { salesCount: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]
    });
    const sales = Array.isArray(salesRaw) ? salesRaw : [];
    // If no sales, return empty best sellers
    if (sales.length === 0) {
      return { products: [], total: 0 };
    }
    // Get product IDs in order
    // Ensure productIds is an array of strings (handle MongoDB ObjectId format)
    const productIds = sales.map((s: any) => typeof s._id === 'object' && s._id.$oid ? s._id.$oid : s._id);
    // Fetch product details
    const productsRaw = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        imageUrl: true,
      },
    });
    // Map salesCount to products and preserve order
    const products = productIds.map((id: string) => {
      const product = productsRaw.find((p) => p.id === id);
      const salesCount = sales.find((s: any) => s._id === id)?.salesCount || 0;
      return product ? { ...product, salesCount } : null;
    }).filter(Boolean);
    // Get total number of products with sales
    const total = await prisma.product.count({ where: { published: true } });
    return { products, total };
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return { products: [], total: 0 };
  }
} 