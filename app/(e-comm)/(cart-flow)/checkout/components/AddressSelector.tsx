"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import useGeolocation from "@/hooks/use-geo";
import LocationLinkExtractor from '../../../../../components/ui/LocationLinkExtractor';

interface AddressSelectorProps {
    open: boolean;
    onClose: () => void;
    onSelect: (coords: { latitude: string; longitude: string }) => void;
}

// --- Main AddressSelector Component ---
export default function AddressSelector({ open, onClose, onSelect }: AddressSelectorProps) {
    const geo = useGeolocation();
    const [geoError, setGeoError] = useState<string | null>(null);

    // Handle use current location
    const handleUseCurrent = () => {
        if (geo.latitude && geo.longitude) {
            setGeoError(null);
            onSelect({ latitude: geo.latitude.toString(), longitude: geo.longitude.toString() });
            onClose();
        } else if (geo.errorMessage) {
            setGeoError(geo.errorMessage);
        }
    };

    // Handle link extraction
    const handleLinkExtract = (coords: { latitude: string; longitude: string }) => {
        onSelect(coords);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 border-0" description="اختر طريقة تحديد الموقع: الصق رابط الموقع أو استخدم موقعك الحالي.">
                <Card className="shadow-lg card-hover-effect card-border-glow">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            تحديد موقع التوصيل
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Step 1: WhatsApp/Google Maps Link Paste */}
                        <LocationLinkExtractor onExtract={handleLinkExtract} />
                        {/* Step 2: Auto-detect location */}
                        <div className="flex gap-2 mt-2">
                            <Button
                                type="button"
                                className="btn-view-outline flex items-center gap-2"
                                onClick={handleUseCurrent}
                                disabled={geo.loading}
                            >
                                {geo.loading ? "جاري تحديد الموقع..." : "استخدم موقعي الحالي"}
                            </Button>
                        </div>
                        {/* Accuracy warning */}
                        {geo.latitude && geo.longitude && geo.accuracy !== null && geo.accuracy > 100 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                                تعذر تحديد الموقع بدقة كافية (الدقة الحالية: {Math.round(geo.accuracy)} متر). الرجاء تفعيل GPS أو المحاولة في مكان مفتوح.
                            </div>
                        )}
                        {/* Success message for geolocation */}
                        {geo.latitude && geo.longitude && geo.accuracy !== null && geo.accuracy <= 100 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-feature-commerce">
                                أفضل دقة تم الوصول إليها: {geo.accuracy} متر
                            </div>
                        )}
                        {/* Error for geolocation */}
                        {geoError && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                                {geoError}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
} 