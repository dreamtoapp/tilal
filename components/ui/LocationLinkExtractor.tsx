import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle } from "lucide-react";
import { extractCoordinatesFromUrl, isValidSharedLocationLink } from '@/utils/extract-latAndLog-fromWhatsAppLink';

interface LocationLinkExtractorProps {
    onExtract: (coords: { latitude: string; longitude: string }) => void;
}

export default function LocationLinkExtractor({ onExtract }: LocationLinkExtractorProps) {
    const [locationLink, setLocationLink] = useState("");
    const [linkError, setLinkError] = useState<string | null>(null);

    const handleExtract = () => {
        if (!isValidSharedLocationLink(locationLink)) {
            setLinkError("الرابط غير صالح. الرجاء لصق رابط موقع Google Maps أو واتساب صحيح.");
            return;
        }
        const coords = extractCoordinatesFromUrl(locationLink);
        if (!coords) {
            setLinkError("تعذر استخراج الإحداثيات من الرابط.");
            return;
        }
        setLinkError(null);
        onExtract({
            latitude: coords.lat.toString(),
            longitude: coords.lng.toString(),
        });
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">الصق رابط الموقع من واتساب أو Google Maps</label>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="ألصق رابط الموقع هنا..."
                    value={locationLink}
                    onChange={e => setLocationLink(e.target.value)}
                    className="flex-1"
                />
                <Button
                    type="button"
                    className="btn-save"
                    onClick={handleExtract}
                >
                    <MapPin className="h-4 w-4 mr-1" /> DEBUG استخراج الإحداثيات
                </Button>
            </div>
            {linkError && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertTriangle className="h-4 w-4" /> {linkError}
                </div>
            )}
        </div>
    );
} 