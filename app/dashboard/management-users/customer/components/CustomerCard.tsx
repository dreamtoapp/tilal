'use client';

import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@prisma/client';

import DeleteCustomerAlert from './DeleteCustomerAlert';
import CustomerUpsert from './CustomerUpsert';
import AddressBook from './AddressBook';

type CustomerCardProps = {
    customer: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
        addresses?: Array<{
            id: string;
            label: string;
            district: string;
            street: string;
            buildingNumber: string;
            floor?: string | null;
            apartmentNumber?: string | null;
            landmark?: string | null;
            deliveryInstructions?: string | null;
            latitude?: string | null;
            longitude?: string | null;
            isDefault: boolean;
        }> | null;
        password?: string | null;
        sharedLocationLink?: string | null;
        image?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        // Customer-specific fields
        preferredPaymentMethod?: string | null;
        deliveryPreferences?: string | null;
        orderCount: number;
        vipLevel?: number | null;
    };
};

export default function CustomerCard({ customer }: CustomerCardProps) {
    const safeCustomer = {
        ...customer,
        name: customer.name || 'No Name',
        email: customer.email || '',
        password: undefined,
        imageUrl: customer.image || undefined,
    };

    const getStatusBadge = (orderCount: number) => {
        if (orderCount === 0) {
            return <Badge variant="secondary" className="bg-neutral-soft-bg text-neutral-fg hover:bg-neutral-soft-bg/90">غير نشط</Badge>;
        } else if (orderCount >= 6) {
            return <Badge variant="default" className="bg-special-soft-bg text-special-fg hover:bg-special-soft-bg/90">VIP</Badge>;
        } else {
            return <Badge variant="default" className="bg-success-soft-bg text-success-fg hover:bg-success-soft-bg/90">نشط</Badge>;
        }
    };

    const getPaymentMethodLabel = (method: string | null) => {
        switch (method) {
            case 'CASH':
                return 'نقداً';
            case 'CARD':
                return 'بطاقة ائتمان';
            case 'WALLET':
                return 'محفظة إلكترونية';
            default:
                return 'غير محدد';
        }
    };

    return (
        <Card className='overflow-hidden rounded-lg border border-primary/20 bg-background text-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] h-[600px] flex flex-col'>
            {/* ===== CARD HEADER ===== */}
            <CardHeader className='border-b border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                            <Icon name="User" size="xs" className="text-primary" />
                        </div>
                        <div>
                            <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
                                {safeCustomer.name}
                            </CardTitle>
                            <div className='text-xs text-muted-foreground flex items-center gap-1'>
                                <Icon name="Phone" size="xs" className="text-primary w-3 h-3" />
                                {customer.phone ? (
                                    <a
                                        href={`tel:${customer.phone}`}
                                        className="hover:text-primary hover:underline transition-colors cursor-pointer"
                                        title="Click to call"
                                    >
                                        {customer.phone}
                                    </a>
                                ) : (
                                    'No Phone'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        {getStatusBadge(customer.orderCount)}
                        <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                            {customer.orderCount} طلب
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* ===== CARD BODY ===== */}
            <CardContent className='p-0 flex-1 overflow-hidden flex flex-col'>
                {/* Profile Image Section */}
                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 flex-shrink-0">
                    <AddImage
                        url={safeCustomer.imageUrl}
                        alt={`${safeCustomer.name}'s profile`}
                        recordId={safeCustomer.id}
                        table="user"
                        tableField='image'
                        onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Scrollable Content Section */}
                <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                    <div className='grid grid-cols-1 gap-3'>
                        {/* Email */}
                        <div className='flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
                            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
                                <Icon name="Mail" size="xs" className="text-primary w-3 h-3" />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-foreground truncate'>
                                    {safeCustomer.email || 'No Email'}
                                </p>
                            </div>
                        </div>



                        {/* Payment Method */}
                        {customer.preferredPaymentMethod && (
                            <div className='flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
                                <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
                                    <Icon name="CreditCard" size="xs" className="text-primary w-3 h-3" />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs text-muted-foreground'>Payment Method</p>
                                    <p className='text-sm font-medium text-foreground truncate'>
                                        {getPaymentMethodLabel(customer.preferredPaymentMethod)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Order Count */}
                        <div className='flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
                            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
                                <Icon name="ShoppingCart" size="xs" className="text-primary w-3 h-3" />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-muted-foreground'>Total Orders</p>
                                <p className='text-sm font-medium text-foreground'>
                                    {customer.orderCount} طلب
                                </p>
                            </div>
                        </div>

                        {/* Delivery Preferences */}
                        {customer.deliveryPreferences && (
                            <div className='flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
                                <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
                                    <Icon name="Truck" size="xs" className="text-primary w-3 h-3" />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs text-muted-foreground'>Delivery Preferences</p>
                                    <p className='text-sm font-medium text-foreground line-clamp-2'>
                                        {customer.deliveryPreferences}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address Section */}
                    <AddressBook
                        addresses={customer.addresses || []}
                        onAddressUpdate={() => window.location.reload()}
                    />
                </div>
            </CardContent>

            {/* ===== CARD FOOTER ===== */}
            <CardFooter className='flex justify-between border-t border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex-shrink-0'>
                <CustomerUpsert
                    mode='update'
                    title="تعديل بيانات العميل"
                    description="يرجى إدخال بيانات العميل المحدثة"
                    defaultValues={{
                        name: customer.name,
                        email: customer.email || '',
                        phone: customer.phone || '',
                        password: customer.password || '',
                    }}
                    userId={customer.id}
                />

                {/* Delete Customer Alert */}
                <DeleteCustomerAlert customerId={safeCustomer.id}>
                    <button className='flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors'>
                        <Icon name="Trash2" size="xs" className="w-3 h-3" />
                        <span className='text-sm'>Delete</span>
                    </button>
                </DeleteCustomerAlert>
            </CardFooter>
        </Card>
    );
} 