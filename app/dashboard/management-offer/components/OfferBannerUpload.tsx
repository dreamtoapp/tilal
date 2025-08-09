'use client';


import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { updateOfferBanner } from '../actions/update-banner';
import { toast } from 'sonner';

interface OfferBannerUploadProps {
    offerId: string;
    offerName: string;
    currentBannerUrl?: string | null;
    onUploadComplete?: (url: string) => void;
}

export function OfferBannerUpload({
    offerId,
    offerName,
    currentBannerUrl,
    onUploadComplete
}: OfferBannerUploadProps) {

    const handleBannerUpload = async (imageUrl: string) => {
        try {
            const result = await updateOfferBanner(offerId, imageUrl);
            if (result.success) {
                toast.success(result.message || 'تم تحديث صورة البانر بنجاح');
                onUploadComplete?.(imageUrl);
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            toast.error('حدث خطأ أثناء تحديث صورة البانر');
        }
    };

    return (
        <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <ImageIcon className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    صورة البانر - {offerName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    اختر صورة بانر جذابة لعرض المجموعة بشكل مميز
                </p>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {/* Banner Upload Area */}
                    <div className="space-y-2">
                        <div className="relative h-64 w-full rounded-xl border-2 border-dashed border-feature-commerce/30 overflow-hidden bg-feature-commerce-soft">
                            <AddImage
                                url={currentBannerUrl || undefined}
                                alt={`صورة بانر ${offerName}`}
                                className="w-full h-full object-cover"
                                recordId={offerId}
                                table="offer"
                                tableField="bannerImage"
                                onUploadComplete={handleBannerUpload}
                                autoUpload={true}
                            />
                            {!currentBannerUrl && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center text-feature-commerce">
                                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                        <p className="text-lg font-medium">انقر لإضافة صورة البانر</p>
                                        <p className="text-sm">الأبعاد المثلى: 1200 × 400 بكسل</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Upload Guidelines */}
                    <div className="bg-muted/30 rounded-lg p-4 border">
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                            إرشادات صورة البانر:
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• الأبعاد المثلى: 1200 × 400 بكسل أو أكبر</li>
                            <li>• الحد الأقصى لحجم الملف: 5 ميجابايت</li>
                            <li>• الصيغ المدعومة: JPG, PNG, WebP</li>
                            <li>• استخدم صور عالية الجودة وواضحة</li>
                            <li>• تجنب النصوص الصغيرة في الصورة</li>
                        </ul>
                    </div>

                    {/* Current Status */}
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${currentBannerUrl ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <span className="text-sm font-medium">
                                {currentBannerUrl ? 'تم رفع صورة البانر' : 'لم يتم رفع صورة البانر بعد'}
                            </span>
                        </div>
                        {currentBannerUrl && (
                            <span className="text-xs text-muted-foreground">
                                انقر على الصورة لتغييرها
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 