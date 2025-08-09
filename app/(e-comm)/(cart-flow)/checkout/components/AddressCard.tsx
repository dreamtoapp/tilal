"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Star, MapPin, Navigation, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useGeolocation from "@/hooks/use-geo";
import { Address as PrismaAddress } from "@prisma/client";
import { extractCoordinatesFromUrl, isValidSharedLocationLink } from '@/utils/extract-latAndLog-fromWhatsAppLink';

// If you need isDefault, extend the Prisma type:
type AddressWithDefault = PrismaAddress & { isDefault?: boolean };

interface AddressCardProps {
    address: AddressWithDefault;
    onEdit?: () => void;
    onDelete?: () => void;
    onSetDefault?: () => void;
    isDefault?: boolean;
    children?: React.ReactNode;
    selectButton?: React.ReactNode;

}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault, isDefault, children, selectButton }) => {
    // Check if coordinates are available
    const hasCoordinates = address.latitude && address.longitude;
    const coordinatesValid = hasCoordinates &&
        !isNaN(parseFloat(address.latitude!)) &&
        !isNaN(parseFloat(address.longitude!));

    // Location picker modal state
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [locationLink, setLocationLink] = useState('');
    const [extracting, setExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);
    const geo = useGeolocation();

    // Extract button disabled logic
    const isExtractDisabled = !locationLink || extracting;

    // Handler for current location
    const handleDetectLocation = () => {
        if (geo.latitude && geo.longitude) {
            handleSetLocation(geo.latitude.toString(), geo.longitude.toString());
        }
    };

    // Handler for extracting coordinates from link
    const handleExtractCoordinates = async () => {
        try {
            setExtracting(true);
            setExtractError(null);

            if (!isValidSharedLocationLink(locationLink)) {
                setExtractError("الرابط غير صالح. الرجاء لصق رابط موقع Google Maps أو واتساب صحيح.");
                return;
            }

            const coords = extractCoordinatesFromUrl(locationLink);
            if (!coords) {
                setExtractError("تعذر استخراج الإحداثيات من الرابط.");
                return;
            }

            // Update the address with coordinates
            await updateAddressLocation(coords.lat.toString(), coords.lng.toString());

            setLocationLink('');
            setLocationModalOpen(false);
        } catch (error) {
            console.error('Extract coordinates error:', error);
            setExtractError("حدث خطأ في استخراج الإحداثيات.");
        } finally {
            setExtracting(false);
        }
    };

    // Function to update address location via API
    const updateAddressLocation = async (latitude: string, longitude: string) => {
        try {
            const response = await fetch(`/api/user/addresses/${address.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...address,
                    latitude,
                    longitude
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update address location');
            }

            // Refresh the page to show updated coordinates
            window.location.reload();
        } catch (error) {
            console.error('Update location error:', error);
            alert('حدث خطأ في تحديث موقع العنوان');
        }
    };

    // Handle location set
    const handleSetLocation = async (lat: string, lng: string) => {
        await updateAddressLocation(lat, lng);
        setLocationModalOpen(false);
    };

    return (
        <Card className={`shadow-lg border-l-4 ${isDefault ? "border-feature-users" : "border-muted"} card-hover-effect card-border-glow mb-2 bg-card transition-all duration-200`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
                    <span className="truncate max-w-[120px] text-card-foreground">{address.label || "عنوان"}</span>
                    {isDefault && (
                        <Badge variant="default" className="bg-feature-users-soft text-feature-users icon-enhanced">افتراضي</Badge>
                    )}
                </CardTitle>
                <div className="flex gap-2">
                    {selectButton /* Must use bg-feature-users text-white border-feature-users etc. for contrast */}

                    {/* Location Button - Only show if coordinates are missing */}
                    {!coordinatesValid && (
                        <Button
                            size="sm"
                            onClick={() => setLocationModalOpen(true)}
                            className="
                                bg-gradient-to-r from-orange-500 to-orange-600 
                                hover:from-orange-600 hover:to-orange-700
                                text-white font-bold
                                flex items-center gap-1 
                                shadow-lg hover:shadow-xl
                                transition-all duration-300 ease-in-out
                                animate-pulse hover:animate-none
                                border-2 border-orange-400/30 hover:border-orange-300/50
                                transform hover:scale-105 active:scale-95
                                relative overflow-hidden group
                                min-w-[100px]
                            "
                            title="تحديد موقع التوصيل - مطلوب"
                            aria-label="تحديد موقع التوصيل"
                        >
                            {/* Background glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 blur-sm group-hover:blur-none transition-all duration-300"></div>

                            {/* Icon with rotation animation */}
                            <MapPin className="
                                h-4 w-4 text-white 
                                group-hover:rotate-12 
                                transition-transform duration-300 ease-in-out
                                drop-shadow-sm relative z-10
                            " />

                            {/* Text */}
                            <span className="text-xs font-bold text-white relative z-10 tracking-wide">
                                تحديد موقع
                            </span>

                            {/* Shine effect on hover */}
                            <div className="
                                absolute inset-0 
                                bg-gradient-to-r from-transparent via-white/20 to-transparent
                                translate-x-[-100%] group-hover:translate-x-[100%]
                                transition-transform duration-700 ease-in-out
                            "></div>
                        </Button>
                    )}

                    {onDelete && (
                        <Button size="sm" className="bg-feature-commerce text-white hover:bg-feature-commerce/90 focus:ring-2 focus:ring-feature-commerce btn-delete icon-enhanced transition-all duration-200" onClick={onDelete} title="حذف العنوان" aria-label="حذف العنوان">
                            <Trash2 className="h-4 w-4 text-white icon-enhanced" />
                        </Button>
                    )}
                    {onEdit && (
                        <Button size="sm" className="bg-feature-settings text-white hover:bg-feature-settings/90 focus:ring-2 focus:ring-feature-settings btn-edit icon-enhanced transition-all duration-200" onClick={onEdit} title="تعديل العنوان" aria-label="تعديل العنوان">
                            <Edit2 className="h-4 w-4 text-white icon-enhanced" />
                        </Button>
                    )}
                    {onSetDefault && !isDefault && (
                        <Button size="sm" className="bg-feature-users text-white hover:bg-feature-users/90 focus:ring-2 focus:ring-feature-users btn-view-outline icon-enhanced transition-all duration-200" onClick={onSetDefault} title="تعيين كافتراضي" aria-label="تعيين كافتراضي">
                            <Star className="h-4 w-4 text-white icon-enhanced" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-card-foreground">
                {/* Address Details Block */}
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-base text-card-foreground">{address.district}, {address.street}</div>
                    <div className="text-card-foreground">مبنى: {address.buildingNumber} {address.floor && `، دور: ${address.floor}`} {address.apartmentNumber && `، شقة: ${address.apartmentNumber}`}</div>
                    {address.landmark && <div className="text-card-foreground">علامة مميزة: {address.landmark}</div>}
                    {address.deliveryInstructions && <div className="text-card-foreground">تعليمات: {address.deliveryInstructions}</div>}
                </div>
                {/* Checklist/Status or Children Section */}
                {children && (
                    <div className="mt-2 flex flex-col gap-2">
                        {children}
                    </div>
                )}
                {/* Location Picker Modal */}
                <AddressLocationModal
                    open={locationModalOpen}
                    onOpenChange={setLocationModalOpen}
                    locationLink={locationLink}
                    setLocationLink={setLocationLink}
                    geo={geo}
                    onDetectLocation={handleDetectLocation}
                    onExtractCoordinates={handleExtractCoordinates}
                    extracting={extracting}
                    extractError={extractError}
                    isExtractDisabled={isExtractDisabled}
                />
                {/* Coordinates Section - Simplified */}
                <div className={`rounded-lg px-3 py-2 mt-3 flex flex-col gap-2
                    ${!coordinatesValid ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}
                `}>
                    <div className="flex items-center gap-2 text-xs mb-1">
                        <MapPin className={`h-4 w-4 ${!coordinatesValid ? 'text-orange-600' : 'text-green-600'} icon-enhanced`} />
                        <span className={`font-medium ${!coordinatesValid ? 'text-orange-700' : 'text-green-700'}`}>
                            {!coordinatesValid ? 'الموقع الجغرافي: غير محدد' : 'الموقع الجغرافي: محدد'}
                        </span>
                    </div>

                    {!coordinatesValid ? (
                        <div className="flex items-center gap-2 text-xs text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>مطلوب تحديد الموقع لإتمام التوصيل</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 justify-between">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-mono">
                                {parseFloat(address.latitude!).toFixed(6)}, {parseFloat(address.longitude!).toFixed(6)}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 flex items-center hover:bg-green-50 border-green-300 text-green-700"
                                onClick={() => window.open(`https://www.google.com/maps?q=${address.latitude},${address.longitude}`, '_blank')}
                                title="فتح في الخرائط"
                                aria-label="فتح في الخرائط"
                            >
                                <Navigation className="h-4 w-4" />
                                <span className="mr-1 text-xs">عرض</span>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const AddressLocationModal: React.FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    locationLink: string;
    setLocationLink: (val: string) => void;
    geo: any;
    onDetectLocation: () => void;
    onExtractCoordinates: () => void;
    extracting: boolean;
    extractError: string | null;
    isExtractDisabled: boolean;
}> = ({
    open,
    onOpenChange,
    locationLink,
    setLocationLink,
    geo,
    onDetectLocation,
    onExtractCoordinates,
    extracting,
    extractError,
    isExtractDisabled,
}) => {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <span className="flex items-center gap-2 text-xl font-bold text-feature-commerce">
                                <Navigation className="h-5 w-5 text-feature-commerce" />
                                تحديد موقع التوصيل
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 p-4">
                        {/* Method 1: Extract from Link */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-feature-commerce flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                الطريقة الأولى: استخراج من رابط الموقع
                            </h3>
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    الصق رابط الموقع من تطبيق واتساب أو Google Maps
                                </p>
                                <Input
                                    value={locationLink}
                                    onChange={e => setLocationLink(e.target.value)}
                                    placeholder="https://maps.google.com/maps?q=24.7136,46.6753"
                                    className="text-sm"
                                />
                                <Button
                                    onClick={onExtractCoordinates}
                                    disabled={isExtractDisabled}
                                    className="
                                        w-full btn-save
                                        bg-gradient-to-r from-green-500 to-green-600 
                                        hover:from-green-600 hover:to-green-700
                                        disabled:from-gray-400 disabled:to-gray-500
                                        text-white font-semibold
                                        shadow-lg hover:shadow-xl
                                        transition-all duration-300 ease-in-out
                                        transform hover:scale-105 disabled:scale-100
                                        border-2 border-green-400/30 hover:border-green-300/50
                                        relative overflow-hidden group
                                    "
                                >
                                    {extracting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>جاري الاستخراج...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                            استخراج الإحداثيات
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        </>
                                    )}
                                </Button>
                                {extractError && (
                                    <div className="flex items-center gap-2 text-xs text-destructive">
                                        <AlertTriangle className="h-3 w-3" />
                                        {extractError}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-border"></div>
                            <span className="text-xs text-muted-foreground">أو</span>
                            <div className="flex-1 h-px bg-border"></div>
                        </div>

                        {/* Method 2: Current Location */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-feature-commerce flex items-center gap-2">
                                <Navigation className="h-4 w-4" />
                                الطريقة الثانية: استخدام موقعك الحالي
                            </h3>
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    تأكد من تفعيل خدمة تحديد الموقع في المتصفح
                                </p>
                                <Button
                                    onClick={onDetectLocation}
                                    disabled={geo.loading}
                                    className="
                                        w-full btn-add
                                        bg-gradient-to-r from-blue-500 to-blue-600 
                                        hover:from-blue-600 hover:to-blue-700
                                        disabled:from-gray-400 disabled:to-gray-500
                                        text-white font-semibold
                                        shadow-lg hover:shadow-xl
                                        transition-all duration-300 ease-in-out
                                        transform hover:scale-105 disabled:scale-100
                                        border-2 border-blue-400/30 hover:border-blue-300/50
                                        relative overflow-hidden group
                                    "
                                    variant="outline"
                                >
                                    {geo.loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>جاري تحديد الموقع...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Navigation className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                            استخدم موقعي الحالي
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        </>
                                    )}
                                </Button>
                                {geo.accuracy && geo.accuracy > 100 && (
                                    <div className="flex items-center gap-2 text-xs text-orange-600">
                                        <AlertTriangle className="h-3 w-3" />
                                        دقة الموقع منخفضة ({Math.round(geo.accuracy)}م). جرب في مكان مفتوح.
                                    </div>
                                )}
                                {geo.statusMessage && (
                                    <div className="text-xs text-muted-foreground">
                                        📍 {geo.statusMessage}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="text-xs font-semibold mb-2 text-feature-commerce">💡 نصائح لتحديد الموقع:</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• من واتساب: شارك الموقع واختر &quot;إرسال موقعك الحالي&quot;</li>
                                <li>• من خرائط جوجل: انقر على موقع → &quot;مشاركة&quot; → انسخ الرابط</li>
                                <li>• تأكد من تفعيل GPS للحصول على دقة أفضل</li>
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

export default AddressCard; 