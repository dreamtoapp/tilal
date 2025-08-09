import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Loading() {
    return (
        <div className="p-6 max-w-4xl mx-auto animate-pulse">
            <div className="h-8 w-1/3 bg-muted rounded mb-4" />
            <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="about">عن الشركة</TabsTrigger>
                    <TabsTrigger value="features">المميزات</TabsTrigger>
                    <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                    <Card className="p-6 mb-4">
                        <div className="h-6 w-1/2 bg-muted rounded mb-4" />
                        <div className="h-4 w-full bg-muted rounded mb-2" />
                        <div className="h-24 w-40 bg-muted rounded mb-4" />
                        <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                        <div className="h-4 w-1/3 bg-muted rounded mb-2" />
                        <div className="h-10 w-32 bg-muted rounded mt-6" />
                    </Card>
                </TabsContent>
                <TabsContent value="features">
                    <Card className="p-6 mb-4">
                        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-24 h-16 bg-muted rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/2 bg-muted rounded" />
                                        <div className="h-4 w-1/3 bg-muted rounded" />
                                    </div>
                                    <div className="w-16 h-8 bg-muted rounded" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="faq">
                    <Card className="p-6 mb-4">
                        <div className="h-6 w-1/3 bg-muted rounded mb-4" />
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="h-12 w-full bg-muted rounded" />
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 