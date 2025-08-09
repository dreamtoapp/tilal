import { Button } from '@/components/ui/button';
// loading.tsx
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Skeleton,
} from '@/components/ui/skeleton'; // Assuming you have a Skeleton component for loading placeholders

export default function Loading() {
  return (
    <form className="space-y-8 rtl">
      {[1, 2, 3].map((section) => (
        <Card key={section} className="border rounded-xl shadow-sm p-6 animate-pulse">
          <div className="mb-4">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-60 mt-2 rounded" />
          </div>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Separator />

      <div className="flex justify-end">
        <Button disabled className="w-full sm:w-auto">
          جاري التحميل...
        </Button>
      </div>
    </form>
  );
}
