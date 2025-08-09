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


import DeleteAdminAlert from './DeleteAdmin';
import AdminUpsert from './AdminUpsert';

type AdminCardProps = {
    admin: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
        password?: string | null;
        image?: string | null;
    };
};

export default function AdminCard({ admin }: AdminCardProps) {
    const safeAdmin = {
        ...admin,
        name: admin.name || 'No Name',
        email: admin.email || '',
        password: undefined,
        imageUrl: admin.image || undefined,
    };



    return (
        <Card className='overflow-hidden rounded-lg border border-primary/20 bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
            {/* Card Header with Admin-specific styling */}
            <CardHeader className='border-b border-primary/20 bg-primary/5 p-4'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
                        {safeAdmin.name}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                        <Badge variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">مشرف</Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className='space-y-4 p-4'>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
                    <AddImage
                        url={safeAdmin.imageUrl}
                        alt={`${safeAdmin.name}'s profile`}
                        recordId={safeAdmin.id}
                        table="user"
                        tableField='image'
                        onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                    />
                </div>

                {/* Admin Details */}
                <div className='space-y-2'>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Mail" size="xs" className="text-primary" />
                        <strong className='font-medium'>Email:</strong> {safeAdmin.email || 'No Email'}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Phone" size="xs" className="text-primary" />
                        <strong className='font-medium'>Phone:</strong> {safeAdmin.phone || 'No Phone'}
                    </p>




                </div>
            </CardContent>

            {/* Card Footer with Admin-specific actions */}
            <CardFooter className='flex justify-between border-t border-primary/20 bg-primary/5 p-4'>
                <AdminUpsert
                    mode='update'
                    title="تعديل بيانات المشرف"
                    description="يرجى إدخال بيانات المشرف المحدثة"
                    defaultValues={{
                        name: admin.name,
                        email: admin.email || '',
                        phone: admin.phone || '',
                        password: admin.password || '',
                    }}
                    adminId={admin.id}
                />

                {/* Delete Admin Alert */}
                <DeleteAdminAlert adminId={safeAdmin.id}>
                    <button className='flex items-center gap-1 text-destructive hover:underline'>
                        <Icon name="Trash2" size="xs" />
                    </button>
                </DeleteAdminAlert>
            </CardFooter>
        </Card>
    );
} 