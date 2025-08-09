'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CheckCircle, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddressForm, { AddressFormData } from '../AddressForm';
import { useRouter } from 'next/navigation';
import { Address as PrismaAddress } from "@prisma/client";
import AddressLocationModal from '../AddressLocationModal';
import GoogleMapsLink from "@/components/GoogleMapsLink";

type Address = PrismaAddress & { isDefault?: boolean };

interface AddressListDialogProps {
    addresses: Address[];
    onSelectAddress?: (address: Address) => void;
}

export default function AddressListDialog({ addresses, onSelectAddress }: AddressListDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [form, setForm] = useState<Partial<AddressFormData>>({});
    const router = useRouter();
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [locationAddress, setLocationAddress] = useState<Address | null>(null);

    const handleSelectAddress = async (address: Address) => {
        try {
            setSelectedAddressId(address.id);

            // Call API to set this address as default
            const response = await fetch(`/api/user/addresses/${address.id}/default`, {
                method: 'POST',
            });

            if (!response.ok) {
                alert('حدث خطأ في تحديد العنوان');
                return;
            }

            // Call the callback if provided (optional)
            onSelectAddress?.(address);

            // Close dialog and refresh page to show updated default address
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Select address error:', error);
            alert('حدث خطأ في تحديد العنوان');
        }
    };

    const handleAddNew = () => {
        setForm({
            label: '',
            district: '',
            street: '',
            buildingNumber: '',
            floor: '',
            apartmentNumber: '',
            landmark: '',
            deliveryInstructions: ''
        });
        setEditingAddress(null);
        setShowAddForm(true);
    };

    const handleEdit = (address: Address) => {
        setForm({
            id: address.id,
            label: address.label || '',
            district: address.district || '',
            street: address.street || '',
            buildingNumber: address.buildingNumber || '',
            floor: address.floor || '',
            apartmentNumber: address.apartmentNumber || '',
            landmark: address.landmark || '',
            deliveryInstructions: address.deliveryInstructions || ''
        });
        setEditingAddress(address);
        setShowAddForm(true);
    };

    const handleFormSuccess = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        setForm({});
        // Refresh the page to show updated addresses
        router.refresh();
    };

    const handleFormCancel = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        setForm({});
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('هل تريد حذف هذا العنوان؟')) return;

        try {
            const response = await fetch(`/api/user/addresses/${addressId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('حدث خطأ في حذف العنوان');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('حدث خطأ في حذف العنوان');
        }
    };

    // Handler for saving location
    const handleLocationSave = async (lat: string, lng: string) => {
        if (!locationAddress) return;
        try {
            const response = await fetch(`/api/user/addresses/${locationAddress.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...locationAddress,
                    latitude: lat,
                    longitude: lng
                })
            });
            if (response.ok) {
                setLocationModalOpen(false);
                setLocationAddress(null);
                router.refresh();
            } else {
                console.error('Failed to save location');
            }
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    // New handler for map location confirmation
    const handleMapLocationConfirm = async (lat: number, lng: number, _accuracy?: number) => {
        if (!locationAddress) return;
        await handleLocationSave(lat.toString(), lng.toString());
    };

    // Single dialog with conditional content
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full h-12 border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft gap-2"
                >
                    <MapPin className="h-4 w-4" />
                    إدارة العناوين ({addresses.length} عناوين متاحة)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {showAddForm ? (
                            <>
                                <ArrowLeft
                                    className="h-5 w-5 text-feature-commerce cursor-pointer hover:text-feature-commerce/80"
                                    onClick={handleFormCancel}
                                />
                                <Plus className="h-5 w-5 text-feature-commerce" />
                                {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
                            </>
                        ) : (
                            <>
                                <MapPin className="h-5 w-5 text-feature-commerce" />
                                اختر عنوان التوصيل
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Conditional Content */}
                {showAddForm ? (
                    /* Form Content */
                    <div className="mt-4">

                        <AddressForm
                            form={form}
                            setForm={setForm}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                            editAddress={editingAddress}
                        />
                    </div>
                ) : (
                    /* Address List Content */
                    <div className="space-y-3 mt-4">
                        {addresses.map((address) => (
                            <Card
                                key={address.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedAddressId === address.id
                                    ? 'border-feature-commerce bg-feature-commerce-soft'
                                    : 'border-muted hover:border-feature-commerce'
                                    }`}
                                onClick={() => handleSelectAddress(address)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-sm">
                                                {address.label || 'عنوان'}
                                            </h4>
                                            {address.isDefault && (
                                                <Badge variant="secondary" className="text-xs bg-feature-commerce-soft text-feature-commerce">
                                                    افتراضي
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(address);
                                                }}
                                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                            >
                                                <Edit2 className="h-3 w-3 text-blue-600" />
                                            </Button>
                                            {!address.isDefault && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(address.id);
                                                    }}
                                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-600" />
                                                </Button>
                                            )}
                                            {(!address.latitude || !address.longitude) && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold flex items-center gap-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out animate-pulse hover:animate-none border-2 border-orange-400/30 hover:border-orange-300/50 transform hover:scale-105 active:scale-95 relative overflow-hidden group min-w-[40px]"
                                                    title="تحديد موقع العنوان"
                                                    aria-label="تحديد موقع العنوان"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setLocationAddress(address);
                                                        setLocationModalOpen(true);
                                                    }}
                                                >
                                                    <MapPin className="h-4 w-4 text-white group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm relative z-10" />
                                                    <span className="text-xs font-bold text-white relative z-10 tracking-wide">تحديد موقع</span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 blur-sm group-hover:blur-none transition-all duration-300"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                                </Button>
                                            )}
                                            {selectedAddressId === address.id && (
                                                <CheckCircle className="h-5 w-5 text-feature-commerce" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div>{address.district}</div>
                                        <div>{address.street}, مبنى {address.buildingNumber}</div>
                                        {address.floor && <div>دور: {address.floor}</div>}
                                        {address.apartmentNumber && <div>شقة: {address.apartmentNumber}</div>}
                                        {address.landmark && (
                                            <div className="text-feature-commerce text-xs">
                                                📍 {address.landmark}
                                            </div>
                                        )}
                                    </div>

                                    {/* Location status */}
                                    <div className="mt-2">
                                        {address.latitude && address.longitude ? (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs border-green-600 text-green-700">
                                                    ✅ موقع محدد
                                                </Badge>
                                                <GoogleMapsLink
                                                    latitude={address.latitude}
                                                    longitude={address.longitude}
                                                    label="عرض على الخريطة"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-feature-commerce hover:text-feature-commerce/80 hover:bg-feature-commerce/10"
                                                />
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="text-xs border-orange-600 text-orange-700">
                                                ⚠️ يحتاج تحديد موقع
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add new address option */}
                        <Card
                            className="border-dashed border-2 border-muted-foreground/30 hover:border-feature-commerce cursor-pointer transition-all duration-200"
                            onClick={handleAddNew}
                        >
                            <CardContent className="p-4 text-center">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-feature-commerce">
                                    <Plus className="h-6 w-6" />
                                    <span className="text-sm font-medium">إضافة عنوان جديد</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>

            {/* AddressLocationModal for setting address location */}
            {locationAddress && (
                <AddressLocationModal
                    open={locationModalOpen}
                    onOpenChange={open => {
                        setLocationModalOpen(open);
                        if (!open) {
                            setLocationAddress(null);
                        }
                    }}
                    locationLink=""
                    setLocationLink={() => { }}
                    linkError={null}
                    geo={{ loading: false, latitude: null, longitude: null }}
                    onDetectLocation={() => { }}
                    isExtractDisabled={false}
                    onLocationConfirm={handleMapLocationConfirm}
                />
            )}
        </Dialog>
    );
} 