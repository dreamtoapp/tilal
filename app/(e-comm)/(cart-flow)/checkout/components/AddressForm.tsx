"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface AddressFormData {
    id?: string;
    label?: string;
    district?: string;
    street?: string;
    buildingNumber?: string;
    floor?: string | null;
    apartmentNumber?: string | null;
    landmark?: string | null;
    deliveryInstructions?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    isDefault?: boolean;
}

interface AddressFormProps {
    form: Partial<AddressFormData>;
    setForm: (f: (prev: Partial<AddressFormData>) => Partial<AddressFormData>) => void;
    onSuccess: () => void;
    onCancel: () => void;
    editAddress?: AddressFormData | null;
}

export default function AddressForm({ form, setForm, onSuccess, onCancel, editAddress }: AddressFormProps) {
    const [formLoading, setFormLoading] = useState(false);

    const handleSave = async () => {
        try {
            setFormLoading(true);

            // Validate required fields
            if (!form.label || !form.district || !form.street || !form.buildingNumber) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }

            const method = editAddress ? "PUT" : "POST";
            const url = editAddress ? `/api/user/addresses/${editAddress.id}` : "/api/user/addresses";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Address save error:', error);
                alert('حدث خطأ في حفظ العنوان');
                return;
            }

            setForm(() => ({}));
            onSuccess();
        } catch (error) {
            console.error('Address save error:', error);
            alert('حدث خطأ في حفظ العنوان');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-sm">اسم العنوان *</label>
                    <Input
                        value={form.label || ""}
                        onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                        placeholder="مثال: المنزل، العمل"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">الحي *</label>
                    <Input
                        value={form.district || ""}
                        onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                        placeholder="مثال: العليا، النزهة"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">الشارع *</label>
                    <Input
                        value={form.street || ""}
                        onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                        placeholder="مثال: شارع الملك فهد"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">رقم المبنى *</label>
                    <Input
                        value={form.buildingNumber || ""}
                        onChange={e => setForm(f => ({ ...f, buildingNumber: e.target.value }))}
                        placeholder="مثال: 12"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">الدور (اختياري)</label>
                    <Input
                        value={form.floor || ""}
                        onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                        placeholder="مثال: 2"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">رقم الشقة (اختياري)</label>
                    <Input
                        value={form.apartmentNumber || ""}
                        onChange={e => setForm(f => ({ ...f, apartmentNumber: e.target.value }))}
                        placeholder="مثال: 5"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm">علامة مميزة (اختياري)</label>
                    <Input
                        value={form.landmark || ""}
                        onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))}
                        placeholder="مثال: بجوار المسجد"
                        className="w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-sm">تعليمات التوصيل (اختياري)</label>
                    <Input
                        value={form.deliveryInstructions || ""}
                        onChange={e => setForm(f => ({ ...f, deliveryInstructions: e.target.value }))}
                        placeholder="أي تفاصيل إضافية للتوصيل..."
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-4 justify-end">
                <Button
                    className="btn-save"
                    onClick={handleSave}
                    disabled={formLoading}
                >
                    {formLoading ? "جاري الحفظ..." : (editAddress ? "حفظ التعديلات" : "إضافة العنوان")}
                </Button>
                <Button
                    className="btn-cancel-outline"
                    variant="outline"
                    onClick={onCancel}
                    disabled={formLoading}
                >
                    إلغاء
                </Button>
            </div>
        </div>
    );
} 