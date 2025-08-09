'use client';

import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import SettingsLayout from '../components/SettingsLayout';

interface TaxInfo {
    taxNumber?: string | null;
    taxOffice?: string | null;
    vatRate?: number | null;
    taxExempt?: boolean;
    taxRegistrationDate?: string | null;
    taxCertificateUrl?: string | null;
}

export default function TaxInfoPage() {
    const [taxData, setTaxData] = useState<TaxInfo>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch tax info data
        const fetchTaxData = async () => {
            try {
                // TODO: Replace with actual API call
                const mockData: TaxInfo = {
                    taxNumber: '123456789',
                    taxOffice: 'مكتب الضرائب الرئيسي',
                    vatRate: 15,
                    taxExempt: false,
                    taxRegistrationDate: '2024-01-01',
                    taxCertificateUrl: null
                };
                setTaxData(mockData);
            } catch (error) {
                console.error('Error fetching tax data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaxData();
    }, []);

    const isComplete = Boolean(
        taxData.taxNumber &&
        taxData.taxOffice &&
        taxData.vatRate !== null
    );

    if (isLoading) {
        return (
            <SettingsLayout
                title="المعلومات الضريبية"
                description="البيانات الضريبية للشركة وإعدادات الضرائب"
                icon={Receipt}
                progress={{
                    current: 0,
                    total: 1,
                    isComplete: false
                }}
            >
                <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">جاري التحميل...</div>
                </div>
            </SettingsLayout>
        );
    }

    return (
        <SettingsLayout
            title="المعلومات الضريبية"
            description="البيانات الضريبية للشركة وإعدادات الضرائب"
            icon={Receipt}
            progress={{
                current: isComplete ? 1 : 0,
                total: 1,
                isComplete
            }}
        >
            <div className="space-y-6">
                <div className="text-center p-8 bg-muted/20 rounded-lg">
                    <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        صفحة المعلومات الضريبية
                    </h3>
                    <p className="text-muted-foreground">
                        سيتم إضافة نموذج إدارة المعلومات الضريبية هنا قريباً
                    </p>
                </div>

                {/* Current Tax Data Display */}
                {Object.keys(taxData).length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-foreground">البيانات الحالية:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {taxData.taxNumber && (
                                <div className="p-3 bg-muted/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground">الرقم الضريبي</p>
                                    <p className="text-sm font-medium">{taxData.taxNumber}</p>
                                </div>
                            )}
                            {taxData.taxOffice && (
                                <div className="p-3 bg-muted/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground">مكتب الضرائب</p>
                                    <p className="text-sm font-medium">{taxData.taxOffice}</p>
                                </div>
                            )}
                            {taxData.vatRate !== null && (
                                <div className="p-3 bg-muted/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground">نسبة الضريبة</p>
                                    <p className="text-sm font-medium">{taxData.vatRate}%</p>
                                </div>
                            )}
                            {taxData.taxRegistrationDate && (
                                <div className="p-3 bg-muted/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground">تاريخ التسجيل الضريبي</p>
                                    <p className="text-sm font-medium">{taxData.taxRegistrationDate}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
} 