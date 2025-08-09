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
import GoogleMapsLink from '@/components/GoogleMapsLink';

import DeleteDriverAlert from './DeleteDriver';
import DriverUpsert from './DriverUpsert';

type DriverCardProps = {
    driver: {
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
        // Driver-specific fields
        vehicleType?: string | null;
        vehiclePlateNumber?: string | null;
        vehicleColor?: string | null;
        vehicleModel?: string | null;
        driverLicenseNumber?: string | null;
        experience?: string | null;
        maxOrders?: string | null;
        driverStatus?: string | null;
    };
};

export default function DriverCard({ driver }: DriverCardProps) {
    const safeDriver = {
        ...driver,
        name: driver.name || 'No Name',
        email: driver.email || '',
        password: undefined,
        imageUrl: driver.image || undefined,
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'ONLINE':
                return <Badge variant="default" className="bg-primary hover:bg-primary/90">متصل</Badge>;
            case 'BUSY':
                return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">مشغول</Badge>;
            default:
                return null;
        }
    };

    const getVehicleTypeLabel = (type: string | null) => {
        switch (type) {
            case 'MOTORCYCLE':
                return 'دراجة نارية';
            case 'CAR':
                return 'سيارة';
            case 'VAN':
                return 'فان';
            case 'TRUCK':
                return 'شاحنة صغيرة';
            case 'BICYCLE':
                return 'دراجة هوائية';
            default:
                return 'غير محدد';
        }
    };

    return (
        <Card className='flex flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
            {/* Card Header with Driver-specific styling */}
            <CardHeader className='border-b border-border bg-muted/50 p-4'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
                        {safeDriver.name}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                        {getStatusBadge(driver.driverStatus || null)}
                    </div>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className='flex-1 space-y-4 p-4'>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
                    <AddImage
                        url={safeDriver.imageUrl}
                        alt={`${safeDriver.name}'s profile`}
                        recordId={safeDriver.id}
                        table="user"
                        tableField='image'
                        onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                    />
                </div>

                {/* Driver Details */}
                <div className='space-y-2'>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Mail" size="xs" className="text-primary" />
                        <strong className='font-medium'>Email:</strong> {safeDriver.email || 'No Email'}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Phone" size="xs" className="text-primary" />
                        <strong className='font-medium'>Phone:</strong> {safeDriver.phone || 'No Phone'}
                    </p>

                    {/* Vehicle Information */}
                    {driver.vehicleType && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Car" size="xs" className="text-primary" />
                            <strong className='font-medium'>Vehicle:</strong> {getVehicleTypeLabel(driver.vehicleType)}
                        </p>
                    )}
                    {driver.vehiclePlateNumber && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Hash" size="xs" className="text-primary" />
                            <strong className='font-medium'>Plate:</strong> {driver.vehiclePlateNumber}
                        </p>
                    )}
                    {driver.vehicleColor && driver.vehicleModel && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Palette" size="xs" className="text-primary" />
                            <strong className='font-medium'>Model:</strong> {driver.vehicleColor} {driver.vehicleModel}
                        </p>
                    )}
                    {driver.experience && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Clock" size="xs" className="text-primary" />
                            <strong className='font-medium'>Experience:</strong> {driver.experience} سنوات
                        </p>
                    )}
                    {driver.maxOrders && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Package" size="xs" className="text-primary" />
                            <strong className='font-medium'>Max Orders:</strong> {driver.maxOrders}
                        </p>
                    )}
                    {/* Address Information */}
                    {driver.addresses && driver.addresses.length > 0 ? (
                        driver.addresses.map((address) => (
                            <div key={address.id} className='space-y-1'>
                                <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <Icon name="MapPin" size="xs" className="text-primary" />
                                    <strong className='font-medium'>{address.label}:</strong>
                                </p>
                                <p className='text-xs text-muted-foreground mr-6'>
                                    {address.district}, {address.street}, مبنى {address.buildingNumber}
                                    {address.apartmentNumber && `، شقة ${address.apartmentNumber}`}
                                    {address.floor && `، طابق ${address.floor}`}
                                    {address.landmark && `، معلم: ${address.landmark}`}
                                </p>
                                <div className='flex items-center gap-2 text-xs text-muted-foreground mr-6'>
                                    {address.latitude && address.longitude ? (
                                        <GoogleMapsLink
                                            latitude={address.latitude}
                                            longitude={address.longitude}
                                            label="عرض على الخريطة"
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary/90 hover:bg-muted"
                                        />
                                    ) : (
                                        <div className="text-xs text-amber-500 flex items-center gap-1">
                                            <Icon name="MapPin" size="xs" className="w-3 h-3" />
                                            لا توجد إحداثيات متاحة
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="MapPin" size="xs" className="text-primary" />
                            <strong className='font-medium'>Address:</strong> No Address
                        </p>
                    )}
                </div>
            </CardContent>

            {/* Card Footer with Driver-specific actions */}
            <CardFooter className='flex justify-between border-t border-border bg-muted/30 p-4'>
                <DriverUpsert
                    mode='update'
                    title="تعديل بيانات السائق"
                    description="يرجى إدخال بيانات السائق المحدثة"
                    defaultValues={{
                        name: driver.name,
                        email: driver.email || '',
                        phone: driver.phone || '',
                        addressLabel: driver.addresses?.[0]?.label || 'المنزل',
                        district: driver.addresses?.[0]?.district || '',
                        street: driver.addresses?.[0]?.street || '',
                        buildingNumber: driver.addresses?.[0]?.buildingNumber || '',
                        floor: driver.addresses?.[0]?.floor || '',
                        apartmentNumber: driver.addresses?.[0]?.apartmentNumber || '',
                        landmark: driver.addresses?.[0]?.landmark || '',
                        deliveryInstructions: driver.addresses?.[0]?.deliveryInstructions || '',
                        password: driver.password || '',

                        vehicleType: driver.vehicleType as 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK' | 'BICYCLE' || 'CAR',
                        vehiclePlateNumber: driver.vehiclePlateNumber || '',
                        vehicleColor: driver.vehicleColor || '',
                        vehicleModel: driver.vehicleModel || '',
                        driverLicenseNumber: driver.driverLicenseNumber || '',
                        experience: driver.experience || '',
                        maxOrders: driver.maxOrders || '3',

                    }}
                    driverId={driver.id}
                />

                {/* Delete Driver Alert */}
                <DeleteDriverAlert driverId={safeDriver.id}>
                    <button className='flex items-center gap-1 text-destructive hover:underline'>
                        <Icon name="Trash2" size="xs" />
                    </button>
                </DeleteDriverAlert>
            </CardFooter>
        </Card>
    );
} 