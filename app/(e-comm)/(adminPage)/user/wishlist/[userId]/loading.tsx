import { Card, CardContent } from '@/components/ui/card';

export default function Loading({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="h-32 w-32 bg-muted rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                    <div className="h-16 bg-muted rounded"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-6 bg-muted rounded w-full"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 