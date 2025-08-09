'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';
// Removed unused import
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { setAsMainImageFromGallery, removeImageFromGallery, updateProductGallery } from '../actions/updateProductImages';

interface ProductGalleryManagerProps {
    product: {
        id: string;
        name: string;
        imageUrl?: string | null;
        images?: string[] | null;
    };
}

export default function ProductGalleryManager({ product }: ProductGalleryManagerProps) {

    // Initialize with merged images array (imageUrl + images combined)
    const [allImages, setAllImages] = useState<string[]>(() => {
        const mergedImages = [...(product.images || [])];

        // Add imageUrl to the beginning if it exists and isn't already in the array
        if (product.imageUrl && !mergedImages.includes(product.imageUrl)) {
            mergedImages.unshift(product.imageUrl);
        }

        return mergedImages;
    });

    const [mainImageUrl, setMainImageUrl] = useState<string | null>(product.imageUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [isUpdating, setIsUpdating] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    // Preview state for new images before upload
    const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([]);

    // Find the main image index in the gallery
    const mainImageIndex = mainImageUrl ? allImages.indexOf(mainImageUrl) : -1;
    const hasGallery = allImages.length > 0;
    const hasPreview = previewImages.length > 0;

    // Cleanup object URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            previewImages.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [previewImages]);

    // Sync effect: Ensure imageUrl is always in the gallery when component mounts or data changes
    useEffect(() => {
        if (product.imageUrl && !allImages.includes(product.imageUrl)) {
            setAllImages(prev => [product.imageUrl!, ...prev]);
        }
    }, [product.imageUrl, allImages]);

    const handleImageSelection = async (files: File[] | null) => {
        if (!files || files.length === 0) return;

        const maxFiles = 10;
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        // Check total images limit (existing + preview + new)
        const totalImages = allImages.length + previewImages.length + files.length;
        if (totalImages > maxFiles) {
            toast.error(`لا يمكن إضافة أكثر من ${maxFiles} صور. لديك حالياً ${allImages.length + previewImages.length} صورة`);
            return;
        }

        // Check each file size
        const invalidFiles = files.filter(file => file.size > maxSizeBytes);
        if (invalidFiles.length > 0) {
            toast.error(`حجم الملفات كبير جداً! الحد الأقصى ${maxSizeMB} ميجا لكل صورة`);
            toast.error(`الملفات المرفوضة: ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        // Check file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        const invalidTypes = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidTypes.length > 0) {
            toast.error('نوع ملف غير مدعوم! يُسمح فقط بـ: JPEG, PNG, WebP, AVIF');
            toast.error(`الملفات المرفوضة: ${invalidTypes.map(f => f.name).join(', ')}`);
            return;
        }

        // All validations passed - add files to preview
        const newPreviewImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviewImages(prev => [...prev, ...newPreviewImages]);
        toast.success(`تم إضافة ${files.length} صورة للمعاينة`);
    };

    const handleUploadAll = async () => {
        if (previewImages.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: previewImages.length });
        const uploadedUrls: string[] = [];

        try {
            console.log('Uploading preview images to Cloudinary:', previewImages);

            // Upload each image to Cloudinary only (without updating database)
            for (let i = 0; i < previewImages.length; i++) {
                const preview = previewImages[i];
                setUploadProgress({ current: i + 1, total: previewImages.length });

                // Create a special FormData for gallery uploads (no database update)
                const formData = new FormData();
                formData.append('file', preview.file);
                formData.append('table', 'product');
                formData.append('uploadOnly', 'true');  // Special flag for upload-only mode

                const response = await fetch('/api/images', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Upload failed for ${preview.file.name}: ${errorData.error || response.statusText}`);
                }

                const data = await response.json();
                if (data.imageUrl) {
                    uploadedUrls.push(data.imageUrl);
                    toast.success(`تم رفع ${preview.file.name} (${i + 1}/${previewImages.length})`);
                } else {
                    throw new Error(data.error || `Failed to upload ${preview.file.name}`);
                }
            }

            // Update gallery with new uploaded images
            const updatedImages = [...allImages, ...uploadedUrls];
            const result = await updateProductGallery(product.id, updatedImages);

            if (result.success) {
                setAllImages(updatedImages);
                setPreviewImages([]); // Clear preview after successful upload
                setUploadComplete(true);

                // Show completion animation for 2 seconds
                setTimeout(() => setUploadComplete(false), 2000);

                toast.success(`تم رفع جميع الصور (${uploadedUrls.length}) إلى Cloudinary بنجاح`, {
                    duration: 4000,
                    description: 'جميع الصور محفوظة ومحسنة للويب'
                });
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`حدث خطأ أثناء رفع الصور: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);

            // If some images were uploaded but database update failed, show partial success
            if (uploadedUrls.length > 0) {
                toast.info(`تم رفع ${uploadedUrls.length} من ${previewImages.length} صور بنجاح`);
            }
        } finally {
            setIsUploading(false);
            // Don't reset progress immediately to show completion state
            setTimeout(() => {
                setUploadProgress({ current: 0, total: 0 });
            }, 2000);
        }
    };

    const removePreviewImage = (index: number) => {
        const imageToRemove = previewImages[index];
        URL.revokeObjectURL(imageToRemove.url); // Clean up memory

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        toast.success('تم حذف الصورة من المعاينة');
    };

    const clearAllPreviews = () => {
        // Clean up all object URLs
        previewImages.forEach(preview => URL.revokeObjectURL(preview.url));
        setPreviewImages([]);
        toast.success('تم مسح جميع الصور المحددة');
    };

    const setAsMainImage = async (index: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const imageUrl = allImages[index];

            // Optimistically update the UI first
            setMainImageUrl(imageUrl);

            // Use the current allImages array for the server call
            const result = await setAsMainImageFromGallery(product.id, imageUrl, allImages);

            if (result.success) {
                toast.success(result.message);
                // State is already updated optimistically
            } else {
                toast.error(result.message);
                // Revert optimistic update on failure
                setMainImageUrl(product.imageUrl ?? null);
            }
        } catch (error) {
            console.error('Error setting main image:', error);
            toast.error('حدث خطأ أثناء تعيين الصورة الرئيسية');
            // Revert optimistic update on error
            setMainImageUrl(product.imageUrl ?? null);
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteImage = async (index: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const imageUrl = allImages[index];
            const result = await removeImageFromGallery(product.id, imageUrl, allImages);

            if (result.success) {
                toast.success(result.message);

                // Remove from local state
                const newImages = allImages.filter(img => img !== imageUrl);
                setAllImages(newImages);

                // If we deleted the main image, clear it or set new main
                if (mainImageUrl === imageUrl) {
                    setMainImageUrl(newImages.length > 0 ? newImages[0] : null);
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('حدث خطأ أثناء حذف الصورة');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* إحصائيات المعرض */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-feature-analytics">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icon name="Images" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                            <div>
                                <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                                <p className="text-2xl font-bold text-feature-analytics">{allImages.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-feature-products">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icon name="Star" className="h-5 w-5 text-feature-products icon-enhanced" />
                            <div>
                                <p className="text-sm text-muted-foreground">الصورة الرئيسية</p>
                                <p className="text-2xl font-bold text-feature-products">{mainImageIndex >= 0 ? '✓' : '✗'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-feature-settings">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icon name="Zap" className="h-5 w-5 text-feature-settings icon-enhanced" />
                            <div>
                                <p className="text-sm text-muted-foreground">حالة التحسين</p>
                                <p className="text-2xl font-bold text-feature-settings">{allImages.length > 0 ? '✓' : '✗'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-feature-commerce">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icon name="HardDrive" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                            <div>
                                <p className="text-sm text-muted-foreground">حجم التخزين</p>
                                <p className="text-2xl font-bold text-feature-commerce">{Math.round((allImages.length * 0.5) * 10) / 10}MB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* منطقة رفع الصور */}
            <Card className="border-l-4 border-l-feature-products card-hover-effect" data-upload-section>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Upload" className="h-5 w-5 text-feature-products icon-enhanced" />
                        اختيار صور جديدة للمعرض
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* زر اختيار الصور البسيط */}
                    <div className="text-center py-8">
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    handleImageSelection(Array.from(files));
                                }
                            }}
                            className="hidden"
                            id="gallery-file-input"
                            disabled={isUploading || (allImages.length + previewImages.length) >= 10}
                        />

                        <label
                            htmlFor="gallery-file-input"
                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg transition-all duration-200 shadow-lg font-medium text-lg ${isUploading || (allImages.length + previewImages.length) >= 10
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-feature-products hover:bg-feature-products/90 text-white cursor-pointer hover:shadow-xl'
                                }`}
                        >
                            <Icon name="Upload" className="h-6 w-6" />
                            {(allImages.length + previewImages.length) >= 10
                                ? 'تم الوصول للحد الأقصى (10 صور)'
                                : 'اختيار صور للمعرض'
                            }
                        </label>

                        <p className="text-sm text-muted-foreground mt-4">
                            يمكن اختيار حتى {10 - allImages.length - previewImages.length} صور إضافية • الحد الأقصى: 5 ميجا لكل صورة
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            الصيغ المدعومة: JPEG, PNG, WebP, AVIF
                        </p>
                    </div>

                    {(isUploading || uploadComplete) && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-feature-products-soft/30 to-blue-50/30 dark:from-feature-products-soft/20 dark:to-blue-950/20 border-2 border-feature-products/40 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {uploadComplete ? (
                                            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                                <Icon name="CheckCircle" className="h-4 w-4 text-white" />
                                            </div>
                                        ) : (
                                            <>
                                                <Icon name="Upload" className="h-6 w-6 text-feature-products animate-pulse" />
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-semibold ${uploadComplete ? 'text-green-600' : 'text-feature-products'}`}>
                                            {uploadComplete ? 'تم رفع جميع الصور بنجاح! ✓' : 'جاري رفع الصور إلى Cloudinary'}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {uploadComplete ? 'جميع الصور محفوظة ومحسنة للويب' : 'يتم رفع الصور بجودة عالية ومحسنة للويب'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-feature-products">
                                        {uploadProgress.current}/{uploadProgress.total}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            {uploadProgress.total > 0 && (
                                <div className="space-y-3">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden ${uploadComplete
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-r from-feature-products to-blue-500'
                                                }`}
                                            style={{ width: `${uploadComplete ? 100 : (uploadProgress.current / uploadProgress.total) * 100}%` }}
                                        >
                                            {/* Animated shine effect */}
                                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${uploadComplete ? 'animate-ping' : 'animate-pulse'
                                                }`}></div>
                                        </div>
                                    </div>

                                    {/* Individual file progress indicators */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {Array.from({ length: uploadProgress.total }, (_, index) => (
                                            <div
                                                key={index}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index < uploadProgress.current
                                                    ? 'bg-green-500 shadow-lg shadow-green-200 dark:shadow-green-900'
                                                    : index === uploadProgress.current
                                                        ? 'bg-feature-products animate-pulse shadow-lg shadow-blue-200 dark:shadow-blue-900'
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                title={`صورة ${index + 1} ${index < uploadProgress.current
                                                    ? '- تم الرفع ✓'
                                                    : index === uploadProgress.current
                                                        ? '- جاري الرفع...'
                                                        : '- في الانتظار'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Status text */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-feature-products">
                                            <div className="w-2 h-2 bg-feature-products rounded-full animate-pulse"></div>
                                            <span className="font-medium">
                                                {uploadProgress.current < uploadProgress.total
                                                    ? `رفع الصورة ${uploadProgress.current + 1}...`
                                                    : 'تم رفع جميع الصور بنجاح! ✓'
                                                }
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            متبقي: {uploadProgress.total - uploadProgress.current}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* معاينة الصور المحددة قبل الرفع - يظهر فقط عند اختيار صور جديدة */}
            {hasPreview && previewImages.length > 0 && (
                <Card className="border-l-4 border-l-amber-500 card-hover-effect bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="AlertCircle" className="h-5 w-5 text-amber-600 icon-enhanced" />
                                <span className="text-amber-800 dark:text-amber-200">
                                    صور جديدة في انتظار الرفع ({previewImages.length})
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAllPreviews}
                                className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
                                disabled={isUploading}
                            >
                                <Icon name="Trash2" className="h-3 w-3 mr-1" />
                                مسح الكل
                            </Button>
                        </CardTitle>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            راجع الصور المحددة وقم بحذف غير المرغوب فيها، ثم اضغط &quot;رفع&quot; لإضافتها للمعرض
                        </p>
                    </CardHeader>
                    <CardContent>
                        {/* صور المعاينة مع تحسين التصميم */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
                            {previewImages.map((preview, index) => (
                                <div
                                    key={index}
                                    className="relative group bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-amber-200 dark:border-amber-800"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-md overflow-hidden border-2 border-dashed border-amber-300 dark:border-amber-700">
                                        <Image
                                            src={preview.url}
                                            alt={`معاينة ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* شارة "جديد" */}
                                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">
                                        جديد
                                    </div>

                                    {/* زر حذف من المعاينة */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={() => removePreviewImage(index)}
                                                    variant="destructive"
                                                    className="h-8 w-8 p-0 shadow-lg"
                                                    disabled={isUploading}
                                                >
                                                    <Icon name="Trash2" className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">حذف من المعاينة</TooltipContent>
                                        </Tooltip>
                                    </div>

                                    {/* معلومات الملف */}
                                    <div className="mt-2 text-center">
                                        <p className="text-xs text-amber-700 dark:text-amber-300 truncate">
                                            {preview.file.name}
                                        </p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400">
                                            {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* أزرار التحكم المحسنة */}
                        <div className="bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleUploadAll}
                                    disabled={isUploading || previewImages.length === 0}
                                    className={`flex-1 h-12 font-medium shadow-md transition-all duration-300 ${isUploading
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                                        }`}
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Icon name="Upload" className="h-5 w-5 animate-pulse" />
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-semibold">
                                                    جاري الرفع... ({uploadProgress.current}/{uploadProgress.total})
                                                </span>
                                                <div className="text-xs opacity-90">
                                                    {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}% مكتمل
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Icon name="Upload" className="h-5 w-5 mr-2" />
                                            <span>رفع إلى Cloudinary ({previewImages.length})</span>
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={clearAllPreviews}
                                    disabled={isUploading}
                                    className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 h-10"
                                >
                                    <Icon name="Trash2" className="h-4 w-4 mr-2" />
                                    إلغاء الكل
                                </Button>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                <Icon name="AlertCircle" className="h-4 w-4" />
                                <span>سيتم رفع الصور إلى المعرض وحفظها في قاعدة البيانات</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* إدارة الصور الموجودة - معرض المنتج الحالي */}
            {hasGallery && (
                <Card className="border-l-4 border-l-feature-analytics card-hover-effect bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="Images" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                <span className="text-feature-analytics">
                                    معرض المنتج الحالي ({allImages.length})
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="CheckCircle" className="h-4 w-4 text-green-500" />
                                <span>محفوظ</span>
                            </div>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            هذه هي الصور المحفوظة حالياً في معرض المنتج. يمكنك تعيين الصورة الرئيسية أو حذف الصور غير المرغوبة.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {allImages.map((image, index) => (
                                <div key={index} className="relative group">
                                    {/* إطار الصورة مع تحسينات */}
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-transparent hover:border-feature-analytics/30 transition-all duration-300 shadow-sm hover:shadow-md">
                                        <Image
                                            src={image}
                                            alt={`صورة ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* مؤشر الصورة الرئيسية المحسن */}
                                    {index === mainImageIndex && (
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium z-10 border-2 border-white dark:border-gray-800">
                                            <Icon name="Star" className="h-3 w-3 inline mr-1" />
                                            رئيسية
                                        </div>
                                    )}

                                    {/* أدوات التحكم المحسنة */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300 rounded-lg">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setAsMainImage(index)}
                                                    className={`h-9 w-9 p-0 shadow-lg transition-all duration-200 ${index === mainImageIndex
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                    disabled={isUpdating || index === mainImageIndex}
                                                >
                                                    {index === mainImageIndex ? (
                                                        <Icon name="CheckCircle" className="h-4 w-4" />
                                                    ) : (
                                                        <Icon name="Star" className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                {index === mainImageIndex ? 'الصورة الرئيسية الحالية' : 'تعيين كصورة رئيسية'}
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={() => deleteImage(index)}
                                                    variant="destructive"
                                                    className="h-9 w-9 p-0 shadow-lg bg-red-600 hover:bg-red-700"
                                                    disabled={isUpdating}
                                                >
                                                    <Icon name="Trash2" className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">حذف من المعرض</TooltipContent>
                                        </Tooltip>
                                    </div>

                                    {/* مؤشر الحالة في الزاوية */}
                                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                                        محفوظ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* رسالة عدم وجود صور - حالة فارغة محسنة */}
            {!hasGallery && (
                <Card className="border-l-4 border-l-gray-300 dark:border-l-gray-600 card-hover-effect bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <CardContent className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            {/* أيقونة متحركة */}
                            <div className="relative mb-6">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center animate-pulse">
                                    <Icon name="Images" className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                                    <Icon name="Upload" className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                لا يوجد معرض صور حتى الآن
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                هذا المنتج لا يحتوي على معرض صور بعد. ابدأ بإضافة الصور لإنشاء معرض جذاب للعملاء وزيادة المبيعات.
                            </p>

                            {/* أزرار الإجراءات */}
                            <div className="space-y-3">
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-12 shadow-lg"
                                    onClick={() => {
                                        // Scroll to the upload section
                                        const uploadSection = document.querySelector('[data-upload-section]');
                                        uploadSection?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <Icon name="Upload" className="h-5 w-5 mr-2" />
                                    ابدأ بإنشاء المعرض
                                </Button>

                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Icon name="CheckCircle" className="h-4 w-4 text-green-500" />
                                    <span>يمكن رفع حتى 10 صور بجودة عالية</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 