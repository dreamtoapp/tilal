"use client";
import AddressCard from "@/app/(e-comm)/(cart-flow)/checkout/components/AddressCard";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Address as PrismaAddress } from "@prisma/client";

type AddressWithDefault = PrismaAddress & { isDefault?: boolean };

interface AddressListProps {
    addresses: AddressWithDefault[];
    // onSelect?: (address: AddressWithDefault) => void;
    // onEdit: (address: AddressWithDefault) => void;
    // onAddressesChanged: () => void;
}

export default function AddressList({ addresses }: AddressListProps) {
    const [expandedChecklist, setExpandedChecklist] = useState<{ [id: string]: boolean }>({});

    const handleDelete = async (id: string, isDefault: boolean) => {
        if (isDefault) {
            alert('لا يمكن حذف العنوان الافتراضي');
            return;
        }
        await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
    };

    const handleSetDefault = async (id: string) => {
        await fetch(`/api/user/addresses/${id}/default`, { method: "POST" });
    };

    return (
        <div className="space-y-2">
            {addresses.map(addr => {
                const requiredFields = [
                    { key: 'district', label: 'الحي', value: addr.district },
                    { key: 'street', label: 'الشارع', value: addr.street },
                    { key: 'buildingNumber', label: 'رقم المبنى', value: addr.buildingNumber },
                    { key: 'label', label: 'اسم العنوان', value: addr.label },
                    { key: 'latitude', label: 'الإحداثيات', value: addr.latitude && addr.longitude },
                ];
                const missingRequired = requiredFields.filter(f => !f.value).length;
                const isComplete = missingRequired === 0;
                const expanded = !!expandedChecklist[addr.id];
                return (
                    <div key={addr.id} className="relative">
                        <AddressCard
                            address={addr}
                            isDefault={!!addr.isDefault}
                            onDelete={() => handleDelete(addr.id, !!addr.isDefault)}
                            onSetDefault={() => handleSetDefault(addr.id)}
                        >
                            {/* Collapsible checklist/status bar inside the card */}
                            <div className="flex flex-col gap-1 mt-2">
                                <button
                                    type="button"
                                    className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium transition-colors ${isComplete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                                    onClick={() => setExpandedChecklist(e => ({ ...e, [addr.id]: !e[addr.id] }))}
                                    aria-expanded={expanded}
                                >
                                    {isComplete ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    )}
                                    {isComplete ? 'مكتمل' : `${missingRequired} مطلوب`}
                                    <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                                    style={{ direction: 'rtl' }}
                                >
                                    <ul className="flex flex-col gap-1 pr-2">
                                        {requiredFields.map(f => (
                                            <li key={f.key} className="flex items-center gap-2 text-xs">
                                                {f.value ? (
                                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                                )}
                                                <span>{f.label}</span>
                                                {!f.value && <span className="text-orange-600">(مطلوب)</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </AddressCard>
                    </div>
                );
            })}
        </div>
    );
} 