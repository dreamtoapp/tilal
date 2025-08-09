import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className='mx-auto my-10 max-w-3xl rounded-md bg-white p-6 shadow-md'>
      {/* Skeleton Loader */}
      <Card>
        <CardHeader>
          <Skeleton className='mb-2 h-8 w-48' /> {/* Invoice Title */}
          <Skeleton className='h-4 w-32' /> {/* Subtitle */}
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Customer Details Skeleton */}
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-6 w-full' />
          {/* Table Skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-8 w-full' /> {/* Table Header */}
            <Skeleton className='h-8 w-full' /> {/* Table Row */}
            <Skeleton className='h-8 w-full' /> {/* Table Row */}
            <Skeleton className='h-8 w-full' /> {/* Table Row */}
          </div>
          {/* Summary Skeleton */}
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-8 w-32' /> {/* Total Amount */}
          {/* Buttons Skeleton */}
          <div className='mt-6 flex justify-between'>
            <Skeleton className='h-20 w-20' /> {/* QR Code */}
            <div className='space-y-2'>
              <Skeleton className='h-10 w-40' /> {/* Download Button */}
              <Skeleton className='h-10 w-40' /> {/* Email Button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default loading;
