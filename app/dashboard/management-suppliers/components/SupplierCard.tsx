'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Supplier } from '@/types/databaseTypes';

import DeleteSupplierAlert from './DeleteSupplierAlert';
import AddSupplier from './SupplierUpsert';

interface SupplierCardProps {
  supplier: Supplier;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAnalytics?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SupplierCard({
  supplier,
}: SupplierCardProps) {
  const {
    id,
    name,
    email,
    phone,
    type,
    address,

    products,
    createdAt,
  } = supplier;

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden">


      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
        <AddImage
          url={supplier.logo ?? ""}
          alt={`${supplier.name}'s profile`}
          recordId={supplier.id}
          table="supplier"
          tableField='logo'
          onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
        />


      </div>

      <div className="flex flex-1 flex-col p-4 space-y-2">
        <div className='flex items-center justify-between'>
          <h3 className="text-lg font-semibold truncate" title={name}>
            {name}
          </h3>
          <Badge variant={"outline"} className='flex items-center gap-2 text-muted-foreground'><Icon name="PackageSearch" className='h-4 w-4 ' />{products.length}</Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate" title={email}>
          {email || '-'}
        </p>
        <p className="text-sm text-muted-foreground">{phone || '-'}</p>
        <p>
          <span className="inline-block rounded-md bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
            {type || 'غير محدد'}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          تاريخ الإضافة: {formatDate(createdAt)}
        </p>
      </div>

      {/* Footer with all action icons */}

      <footer className="flex justify-around border-t px-4 py-2 bg-muted items-center">


        <Link href={`/dashboard/management-suppliers/view/${id}`}
        >
          <Icon name="Eye" className="h-5 w-5" />
        </Link>





        <AddSupplier
          mode='update'
          title={"تعديل مورد"}
          description={"يرجى إدخال بيانات المورد"}
          defaultValues={{
            id,
            type,
            name,
            email,
            phone,
            address,
          }} />





        <Button
          variant="ghost"
          size="sm"
          aria-label="تحليلات"
          onClick={() => alert("comeing soon")}
        >
          <Icon name="BarChart2" className="h-5 w-5" />
        </Button>




        <DeleteSupplierAlert supplierId={id} />


      </footer>

    </div>
  );
}
