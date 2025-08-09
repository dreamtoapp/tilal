"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FileText, DollarSign, ShoppingBag, Calendar, User, X, Package, MapPin, Clock, Mail, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { sendOrderEmail } from '../action/sendOrderEmail';
import type { Order, UserWithCustomerOrders, OrderStatus } from './page';
import Image from 'next/image';

interface UserStatementContentProps {
    user: UserWithCustomerOrders;
    totalSpent: number;
    orderCounts: Record<OrderStatus, number>;
}

export default function UserStatementContent({ user, totalSpent, orderCounts }: UserStatementContentProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className='min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-6' dir='rtl'>
            <div className='mx-auto max-w-7xl'>
                {/* Header Section */}
                <div className='mb-8'>

                    <div className='rounded-xl bg-card p-6 shadow-sm border border-border'>
                        <div className='flex items-start justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-feature-users-soft'>
                                    <User className='h-8 w-8 text-feature-users' />
                                </div>
                                <div>
                                    <h1 className='text-2xl font-bold text-foreground md:text-3xl'>
                                        كشف حساب المستخدم
                                    </h1>
                                    <p className='mt-1 text-lg font-medium text-foreground'>{user.name}</p>
                                    <p className='text-sm text-muted-foreground'>{user.phone}</p>
                                    {user.email && (
                                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className='text-left'>
                                <p className='text-sm text-muted-foreground'>تاريخ الإنشاء</p>
                                <p className='font-medium text-foreground'>
                                    {format(new Date(), 'dd MMMM yyyy', { locale: ar })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    <SummaryCard
                        title='إجمالي الإنفاق'
                        value={`${totalSpent.toFixed(2)} ر.س`}
                        icon={<DollarSign className='h-6 w-6' />}
                        variant='success'
                        description='المبلغ الإجمالي للطلبات'
                    />
                    <SummaryCard
                        title='عدد الطلبات'
                        value={user.customerOrders.length}
                        icon={<ShoppingBag className='h-6 w-6' />}
                        variant='commerce'
                        description='جميع الطلبات المسجلة'
                    />
                    <SummaryCard
                        title='طلبات مكتملة'
                        value={orderCounts.delivered || 0}
                        icon={<FileText className='h-6 w-6' />}
                        variant='delivered'
                        description='الطلبات المسلمة بنجاح'
                    />
                    <SummaryCard
                        title='طلبات معلقة'
                        value={(orderCounts.pending || 0) + (orderCounts.inway || 0)}
                        icon={<Calendar className='h-6 w-6' />}
                        variant='pending'
                        description='طلبات قيد المعالجة'
                    />
                </div>

                {/* Orders Cards */}
                <div className='rounded-xl bg-card shadow-sm border border-border'>
                    <div className='p-6 border-b border-border'>
                        <h3 className='text-lg font-semibold text-foreground'>تفاصيل الطلبات</h3>
                        <p className='mt-1 text-sm text-muted-foreground'>جميع طلبات المستخدم مرتبة حسب التاريخ</p>
                    </div>

                    <div className='p-4'>
                        {user.customerOrders.length === 0 ? (
                            <div className='flex flex-col items-center py-12'>
                                <ShoppingBag className='h-12 w-12 text-muted-foreground mb-4' />
                                <p className='text-muted-foreground font-medium'>لا توجد طلبات بعد</p>
                                <p className='text-sm text-muted-foreground'>سيتم عرض الطلبات هنا بمجرد إنشائها</p>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {user.customerOrders
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((order: Order) => (
                                        <div
                                            key={order.id}
                                            className='bg-muted/20 rounded-lg p-4 border border-border transition-colors hover:bg-muted/30'
                                        >
                                            <div className='flex items-start justify-between mb-3'>
                                                <div>
                                                    <p className='font-medium text-foreground text-sm'>رقم الطلب</p>
                                                    <p className='font-semibold text-foreground'>{order.orderNumber}</p>
                                                    <p className='text-xs text-muted-foreground mt-1'>
                                                        {order.items.length} منتج • {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                                                    </p>
                                                </div>
                                                <StatusBadge status={order.status.toLowerCase() as OrderStatus} />
                                            </div>

                                            <div className='grid grid-cols-2 gap-4 mb-3'>
                                                <div>
                                                    <p className='font-medium text-foreground text-sm mb-1'>التاريخ</p>
                                                    <p className='text-foreground text-sm'>{format(new Date(order.createdAt), 'dd MMM yyyy', { locale: ar })}</p>
                                                    <p className='text-xs text-muted-foreground'>{format(new Date(order.createdAt), 'HH:mm')}</p>
                                                </div>
                                                <div>
                                                    <p className='font-medium text-foreground text-sm mb-1'>المبلغ</p>
                                                    <p className='font-semibold text-status-high-value'>{order.amount.toFixed(2)} ر.س</p>
                                                </div>
                                            </div>

                                            <div className='flex justify-end'>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className='flex items-center gap-2 px-4 py-2 border border-border bg-background text-foreground rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                                                >
                                                    <Package className='h-4 w-4' />
                                                    عرض التفاصيل
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    customerName={user.name}
                    customerEmail={user.email}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

// Enhanced Order Details Modal Component
function OrderDetailsModal({
    order,
    customerName,
    customerEmail,
    onClose
}: {
    order: Order;
    customerName: string;
    customerEmail: string;
    onClose: () => void;
}) {
    const [isEmailSending, setIsEmailSending] = useState(false);

    const handleSendEmail = async () => {
        if (!customerEmail) {
            toast.error('البريد الإلكتروني للعميل غير متوفر');
            return;
        }

        setIsEmailSending(true);
        try {
            const result = await sendOrderEmail({
                to: customerEmail,
                orderData: order,
                customerName: customerName || 'عميل'
            });

            if (result.success) {
                toast.success('تم إرسال تفاصيل الطلبية بنجاح!');
            } else {
                toast.error(result.message || 'فشل في إرسال البريد الإلكتروني');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال البريد الإلكتروني');
        } finally {
            setIsEmailSending(false);
        }
    };



    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <div className='bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                {/* Modal Header */}
                <div className='flex items-center justify-between p-6 border-b border-border'>
                    <div>
                        <h2 className='text-xl font-bold text-foreground'>تفاصيل الطلب</h2>
                        <p className='text-sm text-muted-foreground'>{order.orderNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-muted rounded-lg transition-colors'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* Modal Content */}
                <div className='p-6 space-y-6'>
                    {/* Order Overview */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='bg-muted/30 rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm font-medium text-foreground'>تاريخ الطلب</span>
                            </div>
                            <p className='text-foreground'>{format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: ar })}</p>
                            <p className='text-sm text-muted-foreground'>{format(new Date(order.createdAt), 'HH:mm')}</p>
                        </div>

                        <div className='bg-muted/30 rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <DollarSign className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm font-medium text-foreground'>إجمالي المبلغ</span>
                            </div>
                            <p className='text-xl font-bold text-status-high-value'>{order.amount.toFixed(2)} ر.س</p>
                            <p className='text-sm text-muted-foreground'>{order.paymentMethod || 'نقد عند التسليم'}</p>
                        </div>

                        <div className='bg-muted/30 rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Package className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm font-medium text-foreground'>حالة الطلب</span>
                            </div>
                            <StatusBadge status={order.status.toLowerCase() as OrderStatus} />
                        </div>
                    </div>

                    {/* Address Information */}
                    {order.address && (
                        <div className='bg-muted/30 rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <MapPin className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm font-medium text-foreground'>عنوان التوصيل</span>
                            </div>
                            <div className='text-foreground'>
                                <p>{order.address.district}, {order.address.street}, مبنى {order.address.buildingNumber}</p>
                                {order.address.floor && <p className='text-sm'>الطابق: {order.address.floor}</p>}
                                {order.address.apartmentNumber && <p className='text-sm'>الشقة: {order.address.apartmentNumber}</p>}
                                {order.address.landmark && (
                                    <p className='text-sm text-muted-foreground mt-1'>علامة مميزة: {order.address.landmark}</p>
                                )}
                                {order.address.deliveryInstructions && (
                                    <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm'>
                                        <strong>تعليمات التوصيل:</strong> {order.address.deliveryInstructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shift Information */}
                    {order.shift && (
                        <div className='bg-muted/30 rounded-lg p-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Clock className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm font-medium text-foreground'>وقت التوصيل</span>
                            </div>
                            <p className='text-foreground'>{order.shift.name}</p>
                            <p className='text-sm text-muted-foreground'>{order.shift.startTime} - {order.shift.endTime}</p>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className='bg-muted/30 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-4'>
                            <ShoppingBag className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm font-medium text-foreground'>عناصر الطلبية ({order.items.length} منتج)</span>
                        </div>

                        <div className='space-y-3 max-h-60 overflow-y-auto'>
                            {order.items.map((item) => (
                                <div key={item.id} className='flex items-center gap-4 p-3 bg-background rounded-lg border'>
                                    <div className='flex-shrink-0'>
                                        {item.product?.imageUrl || (item.product?.images && item.product.images[0]) ? (
                                            <Image
                                                src={item.product.imageUrl || item.product.images[0]}
                                                alt={item.product?.name || 'منتج'}
                                                width={48}
                                                height={48}
                                                className='h-12 w-12 rounded-lg object-cover border'
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className='h-12 w-12 bg-muted rounded-lg flex items-center justify-center'>
                                                <ImageIcon className='h-6 w-6 text-muted-foreground' />
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <h4 className='font-medium text-foreground truncate'>
                                            {item.product?.name || 'منتج غير متوفر'}
                                        </h4>
                                        <p className='text-sm text-muted-foreground'>
                                            الكمية: {item.quantity} × {item.price.toFixed(2)} ر.س
                                        </p>
                                    </div>

                                    <div className='text-left'>
                                        <p className='font-semibold text-foreground'>
                                            {(item.quantity * item.price).toFixed(2)} ر.س
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className='mt-4 pt-3 border-t border-border'>
                            <div className='flex items-center justify-between'>
                                <span className='font-medium text-foreground'>إجمالي الطلبية:</span>
                                <span className='text-xl font-bold text-status-high-value'>{order.amount.toFixed(2)} ر.س</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className='flex justify-between items-center p-6 border-t border-border'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                    >
                        إغلاق
                    </button>

                    <div className='flex gap-3'>
                        {customerEmail ? (
                            <button
                                onClick={handleSendEmail}
                                disabled={isEmailSending}
                                className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <Mail className='h-4 w-4' />
                                {isEmailSending ? 'جاري الإرسال...' : 'إرسال بالبريد الإلكتروني'}
                            </button>
                        ) : (
                            <div className='flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm'>
                                <Mail className='h-4 w-4' />
                                البريد الإلكتروني غير متوفر
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const SummaryCard = ({
    title,
    value,
    icon,
    variant,
    description,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    variant: 'success' | 'commerce' | 'delivered' | 'pending';
    description: string;
}) => {
    const getVariantStyles = (variant: string) => {
        const variants = {
            success: {
                iconBg: 'bg-status-high-value text-white',
                textColor: 'text-status-high-value'
            },
            commerce: {
                iconBg: 'bg-feature-commerce text-white',
                textColor: 'text-feature-commerce'
            },
            delivered: {
                iconBg: 'bg-status-high-value text-white',
                textColor: 'text-status-high-value'
            },
            pending: {
                iconBg: 'bg-status-pending text-white',
                textColor: 'text-status-pending'
            }
        };
        return variants[variant as keyof typeof variants] || variants.commerce;
    };

    const styles = getVariantStyles(variant);

    return (
        <div className='rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md border border-border'>
            <div className='flex items-center gap-3 mb-2'>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg}`}>
                    {icon}
                </div>
                <div className='flex-1 flex items-center justify-between'>
                    <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
                    <p className='text-lg font-bold text-foreground'>{value}</p>
                </div>
            </div>
            <p className='text-xs text-muted-foreground'>{description}</p>
        </div>
    );
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const getStatusConfig = (status: OrderStatus) => {
        const configs = {
            delivered: {
                label: 'تم التسليم',
                className: 'bg-status-high-value-soft text-status-high-value border-status-high-value',
            },
            pending: {
                label: 'معلق',
                className: 'bg-status-pending-soft text-status-pending border-status-pending',
            },
            inway: {
                label: 'في الطريق',
                className: 'bg-status-priority-soft text-status-priority border-status-priority',
            },
            canceled: {
                label: 'ملغي',
                className: 'bg-status-urgent-soft text-status-urgent border-status-urgent',
            },
        };
        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
}; 