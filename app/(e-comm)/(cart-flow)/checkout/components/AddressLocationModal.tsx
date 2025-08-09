import React from 'react';
import LocationMapModal from './LocationMapModal';

interface AddressLocationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    locationLink: string;
    setLocationLink: (val: string) => void;
    linkError: string | null;
    geo: any;
    onDetectLocation: () => void;
    isExtractDisabled: boolean;
    onLocationConfirm?: (lat: number, lng: number) => void;
}

const AddressLocationModal: React.FC<AddressLocationModalProps> = ({
    open,
    onOpenChange,
    geo,
    onLocationConfirm,
}) => {
    const handleLocationSave = async (lat: number, lng: number, _accuracy?: number) => {
        if (onLocationConfirm) {
            onLocationConfirm(lat, lng);
        }
        onOpenChange(false);
    };

    return (
        <LocationMapModal
            open={open}
            onOpenChange={onOpenChange}
            onLocationSave={handleLocationSave}
            initialLat={geo.latitude || undefined}
            initialLng={geo.longitude || undefined}
            addressLabel="تحديد موقع العنوان بدقة"
            isRequired={true}
        />
    );
};

export default AddressLocationModal; 