'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, CheckCircle, AlertTriangle, Target, ExternalLink, Save, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import useGeolocation from '@/hooks/use-geo';
import { extractCoordinatesFromUrl, isValidSharedLocationLink } from '@/utils/extract-latAndLog-fromWhatsAppLink';

interface LocationMapModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSave: (lat: number, lng: number, accuracy?: number) => void;
    initialLat?: number;
    initialLng?: number;
    addressLabel?: string;
    isRequired?: boolean;
}

export default function LocationMapModal({
    open,
    onOpenChange,
    onLocationSave,
    initialLat,
    initialLng,
    addressLabel = 'العنوان المحدد',
    isRequired = true
}: LocationMapModalProps) {
    // Location state
    const [selectedLat, setSelectedLat] = useState<number | null>(initialLat || null);
    const [selectedLng, setSelectedLng] = useState<number | null>(initialLng || null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Link extraction state
    const [locationLink, setLocationLink] = useState('');
    const [linkError, setLinkError] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    // UX enhancement states
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);
    const [extractSuccessMessage, setExtractSuccessMessage] = useState<string | null>(null);

    // Geolocation hook
    const geo = useGeolocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        accuracyThreshold: 15,
        maxRetries: 2
    });

    // Initialize with geolocation or initial coordinates
    useEffect(() => {
        if (!selectedLat && !selectedLng && geo.latitude && geo.longitude) {
            setSelectedLat(geo.latitude);
            setSelectedLng(geo.longitude);
            setAccuracy(geo.accuracy);
        }
    }, [geo.latitude, geo.longitude, geo.accuracy, selectedLat, selectedLng]);

    // Reset modal state when opened
    useEffect(() => {
        if (open) {
            setLinkError(null);
            setLocationLink('');
            setIsSaving(false);
            if (initialLat && initialLng) {
                setSelectedLat(initialLat);
                setSelectedLng(initialLng);
            }
        }
    }, [open, initialLat, initialLng]);

    const handleUseCurrentLocation = () => {
        if (geo.latitude && geo.longitude) {
            setSelectedLat(geo.latitude);
            setSelectedLng(geo.longitude);
            setAccuracy(geo.accuracy);
            setLinkError(null);
            setSuccessMessage(null);

            // Show success notification for GPS
            setGpsSuccessMessage(`✅ تم تحديد موقعك بنجاح! الدقة: ${geo.accuracy?.toFixed(0)} متر`);

            // Clear success message after 4 seconds
            setTimeout(() => {
                setGpsSuccessMessage(null);
            }, 4000);
        } else {
            setGpsSuccessMessage(null);
            setLinkError('فشل في الحصول على الموقع الحالي. تأكد من تفعيل GPS والسماح بالوصول للموقع');
        }
    };

    const handleExtractFromLink = async () => {
        if (!locationLink.trim()) {
            setLinkError('يرجى إدخال رابط الموقع');
            setExtractSuccessMessage(null);
            return;
        }

        setIsExtracting(true);
        setLinkError(null);
        setExtractSuccessMessage(null);
        setGpsSuccessMessage(null);

        try {
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 800));

            if (!isValidSharedLocationLink(locationLink)) {
                setLinkError('الرابط غير صالح. يرجى لصق رابط صحيح من Google Maps أو واتساب');
                return;
            }

            const coords = extractCoordinatesFromUrl(locationLink);
            if (!coords) {
                setLinkError('تعذر استخراج الإحداثيات من الرابط. تأكد من صحة الرابط');
                return;
            }

            setSelectedLat(coords.lat);
            setSelectedLng(coords.lng);
            setAccuracy(50); // Estimate accuracy for link-based locations

            // Show success notification for extraction
            setExtractSuccessMessage(`🎯 تم استخراج الموقع بنجاح! الإحداثيات: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);

            setLocationLink(''); // Clear the input after successful extraction

            // Clear success message after 5 seconds
            setTimeout(() => {
                setExtractSuccessMessage(null);
            }, 5000);

        } catch (error) {
            setLinkError('حدث خطأ في معالجة الرابط. تأكد من صحة الرابط المُدخل');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSaveLocation = async () => {
        if (!selectedLat || !selectedLng) {
            setLinkError('يجب تحديد موقع صالح قبل الحفظ');
            return;
        }

        setIsSaving(true);
        setSuccessMessage(null);
        setLinkError(null);

        try {
            // Show saving feedback
            setSuccessMessage('جارٍ حفظ الموقع...');

            await new Promise(resolve => setTimeout(resolve, 1200));
            await onLocationSave(selectedLat, selectedLng, accuracy || undefined);

            // Show final success before closing
            setSuccessMessage('✨ تم حفظ الموقع بنجاح!');

            setTimeout(() => {
                onOpenChange(false);
            }, 1000);

        } catch (error) {
            console.error('Error saving location:', error);
            setSuccessMessage(null);
            setLinkError('فشل في حفظ الموقع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetLocation = () => {
        setSelectedLat(null);
        setSelectedLng(null);
        setAccuracy(null);
        setLocationLink('');
        setLinkError(null);
        setSuccessMessage(null);
        setGpsSuccessMessage(null);
        setExtractSuccessMessage(null);
    };

    const getAccuracyInfo = () => {
        if (!accuracy) return null;
        if (accuracy <= 10) return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'دقة ممتازة', level: 'ممتاز' };
        if (accuracy <= 25) return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Target, text: 'دقة جيدة جداً', level: 'جيد جداً' };
        if (accuracy <= 50) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Target, text: 'دقة جيدة', level: 'جيد' };
        if (accuracy <= 100) return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle, text: 'دقة متوسطة', level: 'متوسط' };
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, text: 'دقة منخفضة', level: 'منخفض' };
    };

    const accuracyInfo = getAccuracyInfo();
    const hasValidLocation = selectedLat && selectedLng;
    const canSave = hasValidLocation && !isSaving;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
                {/* Modern Header */}
                <DialogHeader className="bg-gradient-to-r from-feature-commerce to-feature-commerce/80 text-white p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="p-2 bg-white/20 rounded-full">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <div>تحديد موقع التوصيل</div>
                            <div className="text-sm font-normal opacity-90 mt-1">
                                {addressLabel}
                            </div>
                        </div>
                        {isRequired && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                                مطلوب
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Status Alert */}
                    {isRequired && !hasValidLocation && (
                        <Alert className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                                يجب تحديد موقع دقيق للتوصيل قبل المتابعة في عملية الشراء
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success/Error Notifications */}
                    {gpsSuccessMessage && (
                        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                {gpsSuccessMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {extractSuccessMessage && (
                        <Alert className="border-blue-200 bg-blue-50 animate-in slide-in-from-top-2 duration-300">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                                {extractSuccessMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert className="border-emerald-200 bg-emerald-50 animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <AlertDescription className="text-emerald-800">
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {linkError && (
                        <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {linkError}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Current Location Status */}
                    <Card className="border-l-4 border-l-feature-commerce">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-feature-commerce" />
                                    <h3 className="font-semibold">حالة تحديد الموقع</h3>
                                </div>
                                {hasValidLocation && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetLocation}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-1" />
                                        إعادة تعيين
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* GPS Status */}
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4 text-feature-commerce" />
                                    <span className="text-sm font-medium">GPS الحالي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {geo.loading && (
                                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                                            <div className="animate-spin mr-1 h-3 w-3 border border-current border-t-transparent rounded-full"></div>
                                            جارٍ التحديد
                                        </Badge>
                                    )}
                                    {geo.errorMessage && (
                                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            خطأ
                                        </Badge>
                                    )}
                                    {geo.latitude && geo.longitude && (
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            متاح
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Selected Location */}
                            {hasValidLocation && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">موقع محدد</span>
                                        </div>

                                        {/* Coordinates Display */}
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">خط العرض</Label>
                                                    <div className="font-mono text-sm">{selectedLat.toFixed(6)}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">خط الطول</Label>
                                                    <div className="font-mono text-sm">{selectedLng.toFixed(6)}</div>
                                                </div>
                                            </div>

                                            {/* Accuracy Badge */}
                                            {accuracyInfo && (
                                                <div className="flex items-center justify-between">
                                                    <Badge className={`${accuracyInfo.color} border`}>
                                                        <accuracyInfo.icon className="h-3 w-3 mr-1" />
                                                        {accuracyInfo.text} ({accuracy?.toFixed(0)} متر)
                                                    </Badge>
                                                    <a
                                                        href={`https://www.google.com/maps?q=${selectedLat},${selectedLng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-feature-commerce hover:underline flex items-center gap-1"
                                                    >
                                                        عرض في الخرائط
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Location Input Methods */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* GPS Method */}
                        <Card className="h-fit">
                            <CardHeader>
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-blue-600" />
                                    استخدام GPS
                                </h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    احصل على موقعك الحالي بدقة عالية باستخدام GPS
                                </p>
                                <Button
                                    onClick={handleUseCurrentLocation}
                                    disabled={geo.loading || !geo.latitude || !geo.longitude}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                                >
                                    {geo.loading ? (
                                        <div className="animate-spin mr-2 h-4 w-4 border border-current border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Navigation className="h-4 w-4 mr-2" />
                                    )}
                                    {geo.loading ? 'جارٍ التحديد...' : 'استخدم موقعي الحالي'}
                                </Button>
                                {geo.statusMessage && (
                                    <p className="text-xs text-blue-600 text-center">{geo.statusMessage}</p>
                                )}
                                {geo.errorMessage && (
                                    <p className="text-xs text-red-600 text-center">{geo.errorMessage}</p>
                                )}
                                {gpsSuccessMessage && (
                                    <div className="p-2 bg-green-100 border border-green-200 rounded-md animate-pulse">
                                        <p className="text-xs text-green-700 text-center font-medium">{gpsSuccessMessage}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Link Method */}
                        <Card className="h-fit">
                            <CardHeader>
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5 text-green-600" />
                                    رابط الموقع
                                </h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    الصق رابط موقع من واتساب أو خرائط جوجل
                                </p>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="ألصق رابط الموقع هنا..."
                                        value={locationLink}
                                        onChange={(e) => {
                                            setLocationLink(e.target.value);
                                            setLinkError(null);
                                            setExtractSuccessMessage(null);
                                            setGpsSuccessMessage(null);
                                        }}
                                        className="text-sm transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                        disabled={isExtracting}
                                    />
                                    <Button
                                        onClick={handleExtractFromLink}
                                        disabled={isExtracting || !locationLink.trim()}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                                    >
                                        {isExtracting ? (
                                            <div className="animate-spin mr-2 h-4 w-4 border border-current border-t-transparent rounded-full"></div>
                                        ) : (
                                            <MapPin className="h-4 w-4 mr-2" />
                                        )}
                                        {isExtracting ? 'جارٍ الاستخراج...' : 'استخراج الموقع'}
                                    </Button>
                                </div>
                                {extractSuccessMessage && (
                                    <div className="p-2 bg-blue-100 border border-blue-200 rounded-md animate-pulse">
                                        <p className="text-xs text-blue-700 text-center font-medium">{extractSuccessMessage}</p>
                                    </div>
                                )}
                                {linkError && (
                                    <div className="p-2 bg-red-100 border border-red-200 rounded-md">
                                        <p className="text-xs text-red-700 text-center font-medium">{linkError}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>



                    {/* Interactive Map Preview */}
                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-feature-commerce" />
                                معاينة الموقع
                            </h3>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-64 bg-gradient-to-br from-feature-commerce-soft/30 to-feature-commerce-soft/10 rounded-lg relative overflow-hidden flex items-center justify-center">
                                {/* Grid Background */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                                        {Array.from({ length: 96 }).map((_, i) => (
                                            <div key={i} className="border border-feature-commerce/30"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Map Content */}
                                <div className="text-center space-y-3 z-10">
                                    <div className="relative">
                                        <MapPin className={`h-12 w-12 mx-auto ${hasValidLocation ? 'text-green-600 animate-bounce' : 'text-muted-foreground/50'}`} />
                                        {hasValidLocation && (
                                            <CheckCircle className="absolute -top-1 -right-1 h-6 w-6 text-green-600 bg-white rounded-full p-1" />
                                        )}
                                    </div>
                                    <div>
                                        {hasValidLocation ? (
                                            <div className="space-y-1">
                                                <p className="font-medium text-green-800">موقع محدد بنجاح</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedLat?.toFixed(4)}, {selectedLng?.toFixed(4)}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground">لم يتم تحديد موقع بعد</p>
                                                <p className="text-xs text-muted-foreground">
                                                    استخدم GPS أو الصق رابط لتحديد الموقع
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleSaveLocation}
                        disabled={!canSave}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                        size="lg"
                    >
                        {isSaving ? (
                            <div className="animate-spin mr-2 h-4 w-4 border border-current border-t-transparent rounded-full"></div>
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {isSaving ? 'جارٍ الحفظ...' : 'حفظ الموقع'}
                    </Button>

                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="flex-1 py-3"
                        size="lg"
                        disabled={isRequired && !hasValidLocation}
                    >
                        {isRequired && !hasValidLocation ? 'يجب تحديد موقع' : 'إلغاء'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 