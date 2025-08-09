'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddressListDialog from "./client/AddressListDialog";
import { Address as PrismaAddress } from "@prisma/client";
import { useRouter } from "next/navigation";
import GoogleMapsLink from "@/components/GoogleMapsLink";

export type AddressWithDefault = PrismaAddress & { isDefault?: boolean };

interface AddressBookProps {
    addresses: AddressWithDefault[];
    selectedAddressId: string;
    onSelectAddress: (id: string) => void;
}

export default function AddressBook({ addresses, selectedAddressId, onSelectAddress }: AddressBookProps) {
    const router = useRouter();

    // Safe check for undefined addresses
    const safeAddresses = addresses || [];
    const defaultAddress = safeAddresses.find(addr => addr.isDefault) || safeAddresses[0];

    const handleAddAddress = () => {
        router.push('/user/addresses?redirect=/checkout');
    };

    if (!safeAddresses || safeAddresses.length === 0) {
        return (
            <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        عنوان التوصيل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">لم يتم إضافة عنوان بعد</p>
                        <p className="text-sm text-orange-600 mb-4">
                            يجب إضافة عنوان للتوصيل قبل المتابعة في عملية الشراء
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={handleAddAddress}
                                className="w-full bg-feature-suppliers hover:bg-feature-suppliers/90 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                إضافة عنوان جديد
                            </button>
                            <div className="text-sm text-muted-foreground">أو</div>
                            <AddressListDialog addresses={[]} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    عنوان التوصيل
                    {defaultAddress && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Address List with selection */}
                {safeAddresses.map(addr => (
                    <div key={addr.id} className={`p-4 rounded-lg border flex items-center gap-3 mb-2 ${selectedAddressId === addr.id ? 'border-feature-commerce bg-feature-commerce-soft' : 'border-muted'}`}>
                        <input
                            type="radio"
                            checked={selectedAddressId === addr.id}
                            onChange={() => onSelectAddress(addr.id)}
                            className="accent-feature-commerce"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{addr.label || 'عنوان'}</div>
                            <div className="text-sm text-muted-foreground">{addr.district}, {addr.street}, مبنى {addr.buildingNumber}</div>
                            {addr.latitude && addr.longitude && (
                                <div className="mt-2">
                                    <GoogleMapsLink
                                        latitude={addr.latitude}
                                        longitude={addr.longitude}
                                        label="عرض على الخريطة"
                                        variant="ghost"
                                        size="sm"
                                        className="text-feature-commerce hover:text-feature-commerce/80 hover:bg-feature-commerce/10"
                                    />
                                </div>
                            )}
                        </div>
                        {addr.isDefault && <Badge className="bg-feature-commerce text-white">افتراضي</Badge>}
                    </div>
                ))}
                {/* Address Management */}
                <AddressListDialog addresses={safeAddresses} />
            </CardContent>
        </Card>
    );
} 