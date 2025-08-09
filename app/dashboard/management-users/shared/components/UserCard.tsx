'use client'; // Mark as a Client Component
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@prisma/client';
import GoogleMapsLink from '@/components/GoogleMapsLink';

import DeleteDriverAlert from './DeleteUser';
import AddUser from './UserUpsert';

type UserCardProps = {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: UserRole;
    address?: string | null;
    password?: string | null;
    sharedLocationLink?: string | null;
    image?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  };
};

export default function UserCard({ user }: UserCardProps) {
  const safeUser = {
    ...user,
    name: user.name || 'No Name',
    email: user.email || '',
    password: undefined,
    imageUrl: user.image || undefined,
  };

  // Dynamic title/description based on role
  let title = 'تعديل مستخدم';
  let description = 'يرجى إدخال بيانات المستخدم';
  if (user.role === 'DRIVER') {
    title = 'تعديل سائق';
    description = 'يرجى إدخال بيانات السائق';
  } else if (user.role === 'ADMIN') {
    title = 'تعديل مشرف';
    description = 'يرجى إدخال بيانات المشرف';
  } else if (user.role === 'CUSTOMER') {
    title = 'تعديل عميل';
    description = 'يرجى إدخال بيانات العميل';
  }

  return (
    <Card className='overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
      {/* Card Header */}
      <CardHeader className='border-b border-border bg-muted/50 p-4'>
        <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
          {safeUser.name}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className='space-y-4 p-4'>
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
          <AddImage
            url={safeUser.imageUrl}
            alt={`${safeUser.name}'s profile`}
            recordId={safeUser.id}
            table="user"
            tableField='image'
            onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
          />
        </div>

        {/* Details */}
        <div className='space-y-2'>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Email:</strong> {safeUser.email || 'No Email'}
          </p>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Phone:</strong> {safeUser.phone || 'No Phone'}
          </p>
          {user.latitude && user.longitude && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <strong className='font-medium'>Location:</strong>
              <GoogleMapsLink
                latitude={user.latitude}
                longitude={user.longitude}
                label="عرض على الخريطة"
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              />
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className='flex justify-between border-t border-border bg-muted/50 p-4'>
        <AddUser
          role={user.role}
          mode='update'
          title={title}
          description={description}
          defaultValues={{
            name: user.name,
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            password: user.password || '',
            sharedLocationLink: user.sharedLocationLink || '',
            latitude: user.latitude || '',
            longitude: user.longitude || '',
          }} />
        {/* Delete Driver Alert */}
        <DeleteDriverAlert driverId={safeUser.id}>
          <button className='flex items-center gap-1 text-destructive hover:underline'>
            <Icon name="Trash2" size="xs" />
          </button>
        </DeleteDriverAlert>
      </CardFooter>
    </Card>
  );
}
