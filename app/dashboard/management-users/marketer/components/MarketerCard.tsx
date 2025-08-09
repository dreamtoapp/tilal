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

import DeleteMarketerAlert from './DeleteMarketer';
import MarketerUpsert from './MarketerUpsert';

type MarketerCardProps = {
    marketer: {
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
        // Marketer-specific fields
        marketerLevel?: string | null;
        specialization?: string | null;
        targetAudience?: string | null;
        commissionRate?: number | null;
        performanceRating?: number | null;
        marketerStatus?: string | null;
    };
};

export default function MarketerCard({ marketer }: MarketerCardProps) {
    const safeMarketer = {
        ...marketer,
        name: marketer.name || 'No Name',
        email: marketer.email || '',
        password: undefined,
        imageUrl: marketer.image || undefined,
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="default" className="bg-green-600 hover:bg-green-700">نشط</Badge>;
            case 'INACTIVE':
                return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">غير نشط</Badge>;
            case 'SUSPENDED':
                return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">معلق</Badge>;
            default:
                return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">غير محدد</Badge>;
        }
    };

    const getLevelBadge = (level: string | null) => {
        switch (level) {
            case 'JUNIOR':
                return <Badge variant="outline" className="border-blue-400 text-blue-700">مبتدئ</Badge>;
            case 'SENIOR':
                return <Badge variant="outline" className="border-green-400 text-green-700">خبير</Badge>;
            case 'LEAD':
                return <Badge variant="outline" className="border-purple-400 text-purple-700">قائد</Badge>;
            case 'MANAGER':
                return <Badge variant="outline" className="border-orange-400 text-orange-700">مدير</Badge>;
            default:
                return <Badge variant="outline" className="border-gray-400 text-gray-700">غير محدد</Badge>;
        }
    };

    return (
        <Card className='overflow-hidden rounded-lg border border-orange-200 bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
            {/* Card Header with Marketer-specific styling */}
            <CardHeader className='border-b border-orange-200 bg-orange-50/50 p-4'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='line-clamp-1 text-lg font-semibold text-orange-700'>
                        {safeMarketer.name}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                        {getStatusBadge(marketer.marketerStatus || null)}
                        {getLevelBadge(marketer.marketerLevel || null)}
                    </div>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className='space-y-4 p-4'>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
                    <AddImage
                        url={safeMarketer.imageUrl}
                        alt={`${safeMarketer.name}'s profile`}
                        recordId={safeMarketer.id}
                        table="user"
                        tableField='image'
                        onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                    />
                </div>

                {/* Marketer Details */}
                <div className='space-y-2'>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Mail" size="xs" className="text-orange-600" />
                        <strong className='font-medium'>Email:</strong> {safeMarketer.email || 'No Email'}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Phone" size="xs" className="text-orange-600" />
                        <strong className='font-medium'>Phone:</strong> {safeMarketer.phone || 'No Phone'}
                    </p>

                    {/* Marketer Level */}
                    {marketer.marketerLevel && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="TrendingUp" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Level:</strong> {getLevelBadge(marketer.marketerLevel)}
                        </div>
                    )}

                    {/* Specialization */}
                    {marketer.specialization && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Target" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Specialization:</strong>
                            <span className="line-clamp-1">{marketer.specialization}</span>
                        </p>
                    )}

                    {/* Target Audience */}
                    {marketer.targetAudience && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Users" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Target:</strong>
                            <span className="line-clamp-1">{marketer.targetAudience}</span>
                        </p>
                    )}

                    {/* Commission Rate */}
                    {marketer.commissionRate !== null && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Percent" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Commission:</strong> {marketer.commissionRate}%
                        </p>
                    )}

                    {/* Performance Rating */}
                    {marketer.performanceRating !== null && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Star" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Rating:</strong> {marketer.performanceRating}/5
                        </p>
                    )}

                    {/* Address Information */}
                    {marketer.addresses && marketer.addresses.length > 0 ? (
                        marketer.addresses.map((address) => (
                            <div key={address.id} className='space-y-1'>
                                <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <Icon name="MapPin" size="xs" className="text-orange-600" />
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
                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                        />
                                    ) : (
                                        <div className="text-xs text-amber-600 flex items-center gap-1">
                                            <Icon name="MapPin" size="xs" className="w-3 h-3" />
                                            لا توجد إحداثيات متاحة
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="MapPin" size="xs" className="text-orange-600" />
                            <strong className='font-medium'>Address:</strong> No Address
                        </p>
                    )}
                </div>
            </CardContent>

            {/* Card Footer with Marketer-specific actions */}
            <CardFooter className='flex justify-between border-t border-orange-200 bg-orange-50/30 p-4'>
                <MarketerUpsert
                    mode='update'
                    title="تعديل بيانات المسوق"
                    description="يرجى إدخال بيانات المسوق المحدثة"
                    defaultValues={{
                        name: marketer.name,
                        email: marketer.email || '',
                        phone: marketer.phone || '',
                        addressLabel: marketer.addresses?.[0]?.label || 'العمل',
                        district: marketer.addresses?.[0]?.district || '',
                        street: marketer.addresses?.[0]?.street || '',
                        buildingNumber: marketer.addresses?.[0]?.buildingNumber || '',
                        floor: marketer.addresses?.[0]?.floor || '',
                        apartmentNumber: marketer.addresses?.[0]?.apartmentNumber || '',
                        landmark: marketer.addresses?.[0]?.landmark || '',
                        deliveryInstructions: marketer.addresses?.[0]?.deliveryInstructions || '',
                        password: marketer.password || '',
                        sharedLocationLink: marketer.sharedLocationLink || '',
                        latitude: marketer.addresses?.[0]?.latitude || marketer.latitude || '',
                        longitude: marketer.addresses?.[0]?.longitude || marketer.longitude || '',
                        marketerLevel: marketer.marketerLevel as 'JUNIOR' | 'SENIOR' | 'LEAD' | 'MANAGER' || 'JUNIOR',
                        specialization: marketer.specialization || '',
                        targetAudience: marketer.targetAudience || '',
                        commissionRate: marketer.commissionRate || 10,
                        performanceRating: marketer.performanceRating || 0,
                        marketerStatus: marketer.marketerStatus as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' || 'ACTIVE',
                    }}
                    marketerId={marketer.id}
                />

                {/* Delete Marketer Alert */}
                <DeleteMarketerAlert marketerId={safeMarketer.id}>
                    <button className='flex items-center gap-1 text-destructive hover:underline'>
                        <Icon name="Trash2" size="xs" />
                    </button>
                </DeleteMarketerAlert>
            </CardFooter>
        </Card>
    );
} 