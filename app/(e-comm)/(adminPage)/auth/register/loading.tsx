import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm shadow-lg border-l-4 border-feature-users card-hover-effect card-border-glow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Skeleton className="h-5 w-5 rounded-full bg-feature-users-soft" />
                        <Skeleton className="h-6 w-32 bg-feature-users-soft" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-10 w-full bg-feature-users-soft" />
                        <Skeleton className="h-10 w-full bg-feature-users-soft" />
                        <Skeleton className="h-10 w-full bg-feature-users-soft" />
                        <Skeleton className="h-10 w-full bg-feature-users-soft" />
                        <Skeleton className="h-12 w-full bg-feature-users-soft mt-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 