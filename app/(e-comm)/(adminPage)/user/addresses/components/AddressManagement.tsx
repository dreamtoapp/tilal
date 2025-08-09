'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus, MapPin, Edit, Trash2, Star, Home, Building, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AddressForm from './AddressForm';
import { getAddresses, deleteAddress, setDefaultAddress } from '../actions/addressActions';
import { toast } from 'sonner';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';

interface Address {
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
    createdAt: Date;
    updatedAt: Date;
}

interface AddressManagementProps {
    userId: string;
}

export default function AddressManagement({ userId }: AddressManagementProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showDefaultDeleteAlert, setShowDefaultDeleteAlert] = useState(false);
    const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

    const loadAddresses = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getAddresses(userId);
            if (result.success) {
                setAddresses(result.addresses);
            } else {
                toast.error(result.message || 'فشل في تحميل العناوين');
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            toast.error('حدث خطأ أثناء تحميل العناوين');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadAddresses();

        // Check for welcome message from registration
        const welcome = searchParams.get('welcome');
        const message = searchParams.get('message');
        if (welcome === 'true' && message) {
            toast.success(message);
        }
    }, [searchParams, loadAddresses]);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsDialogOpen(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

    const handleDeleteAddress = async (addressId: string) => {
        const address = addresses.find(a => a.id === addressId);
        if (address?.isDefault) {
            toast.error('لا يمكن حذف العنوان الافتراضي. يرجى تعيين عنوان افتراضي آخر أولاً.');
            return;
        }
        // Show custom confirmation dialog (if you have one), or proceed directly
        try {
            const result = await deleteAddress(addressId);
            if (result.success) {
                toast.success('تم حذف العنوان بنجاح');
                loadAddresses();
            } else {
                toast.error(result.message || 'فشل في حذف العنوان');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('حدث خطأ أثناء حذف العنوان');
        }
    };

    const handleSetDefault = async (addressId: string) => {
        setSettingDefaultId(addressId);
        try {
            const result = await setDefaultAddress(addressId);
            if (result.success) {
                toast.success('تم تعيين العنوان كافتراضي بنجاح');
                loadAddresses();
            } else {
                toast.error(result.message || 'فشل في تعيين العنوان كافتراضي');
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('حدث خطأ أثناء تعيين العنوان كافتراضي');
        } finally {
            setSettingDefaultId(null);
        }
    };

    const handleFormSubmit = () => {
        setIsDialogOpen(false);
        setEditingAddress(null);
        const redirectTo = searchParams.get('redirect');
        if (redirectTo) {
            router.push(redirectTo);
        } else {
            loadAddresses();
        }
    };

    const handleFormCancel = () => {
        setIsDialogOpen(false);
        setEditingAddress(null);
    };

    const getAddressIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case 'المنزل':
            case 'home':
                return <Home className="h-4 w-4" />;
            case 'العمل':
            case 'work':
                return <Building className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">إدارة العناوين</h1>
                    <p className="text-muted-foreground">أضف أو عدّل عناوين التوصيل الخاصة بك</p>
                </div>
                <div className="flex items-center gap-2">

                    <Link href="/" className={buttonVariants({ variant: "default" })}>
                        <Icon name='ShoppingBag' className="h-4 w-4 ml-2" />
                        تسوق الان
                    </Link>



                    <Button onClick={handleAddAddress} className="btn-add">
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة عنوان
                    </Button>

                </div>
            </div>

            {/* Addresses List */}
            {addresses.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">لا توجد عناوين</h3>
                        <p className="text-muted-foreground mb-4">
                            أضف عنوانك الأول لتسهيل عملية التوصيل
                        </p>
                        <Button onClick={handleAddAddress} className="btn-add">
                            <Plus className="h-4 w-4 ml-2" />
                            إضافة عنوان جديد
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className="shadow-lg border-l-4 border-l-feature-users">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        {getAddressIcon(address.label)}
                                        <span>{address.label}</span>
                                        {address.isDefault && (
                                            <Badge variant="secondary" className="bg-feature-users-soft text-feature-users">
                                                <Star className="h-3 w-3 ml-1" />
                                                افتراضي
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditAddress(address)}
                                            className="text-feature-users hover:bg-feature-users-soft"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        {address.isDefault ? (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50"
                                                    onClick={() => setShowDefaultDeleteAlert(true)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog open={showDefaultDeleteAlert} onOpenChange={setShowDefaultDeleteAlert}>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>لا يمكن حذف العنوان الافتراضي</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                يجب تعيين عنوان افتراضي آخر قبل حذف هذا العنوان. يرجى اختيار عنوان آخر كافتراضي ثم حاول مرة أخرى.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction onClick={() => setShowDefaultDeleteAlert(false)} autoFocus>
                                                                فهمت
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>حذف العنوان</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            حذف
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="font-medium">
                                        {address.street}، {address.buildingNumber}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {address.district}
                                        {address.floor && `، الطابق ${address.floor}`}
                                        {address.apartmentNumber && `، شقة ${address.apartmentNumber}`}
                                    </p>
                                    {address.landmark && (
                                        <p className="text-sm text-muted-foreground">
                                            قريب من: {address.landmark}
                                        </p>
                                    )}
                                    {address.deliveryInstructions && (
                                        <p className="text-sm text-muted-foreground">
                                            تعليمات التوصيل: {address.deliveryInstructions}
                                        </p>
                                    )}
                                    {address.latitude && address.longitude && (
                                        <div className="mt-2">
                                            <GoogleMapsLink
                                                latitude={address.latitude}
                                                longitude={address.longitude}
                                                label="عرض على الخريطة"
                                                variant="ghost"
                                                size="sm"
                                                className="text-feature-users hover:text-feature-users/80 hover:bg-feature-users/10"
                                            />
                                        </div>
                                    )}
                                </div>
                                {!address.isDefault && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefault(address.id)}
                                            className="w-full"
                                            disabled={settingDefaultId === address.id}
                                        >
                                            {settingDefaultId === address.id ? (
                                                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                            ) : (
                                                <Star className="h-4 w-4 ml-2" />
                                            )}
                                            تعيين كافتراضي
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Address Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
                        </DialogTitle>
                    </DialogHeader>
                    <AddressForm
                        userId={userId}
                        address={editingAddress || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 