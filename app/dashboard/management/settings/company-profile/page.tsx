import { fetchCompany } from '../actions/fetchCompany';
import CompanyProfileForm from './components/CompanyProfileForm';
import SettingsLayout from '../components/SettingsLayout';
import { Building2 } from 'lucide-react';

export default async function CompanyProfilePage() {
    const companyData = await fetchCompany();

    const isComplete = !!(companyData?.fullName && companyData?.email && companyData?.phoneNumber);

    return (
        <SettingsLayout
            title="معلومات الشركة"
            description="البيانات الأساسية للشركة ومعلومات الاتصال"
            icon={Building2}
            progress={{
                current: isComplete ? 1 : 0,
                total: 1,
                isComplete
            }}
        >
            <CompanyProfileForm company={companyData} />
        </SettingsLayout>
    );
} 