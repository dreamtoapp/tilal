import { fetchCompany } from '../actions/fetchCompany';
import SettingsLayout from '../components/SettingsLayout';
import { MapPin } from 'lucide-react';
import LocationForm from './components/LocationForm';

export default async function LocationPage() {
    const companyData = await fetchCompany();

    const isComplete = !!(companyData?.address && companyData?.latitude && companyData?.longitude);

    return (
        <SettingsLayout
            title="الموقع والعنوان"
            description="العنوان الفعلي وإحداثيات الموقع"
            icon={MapPin}
            progress={{
                current: isComplete ? 1 : 0,
                total: 1,
                isComplete
            }}
        >
            <LocationForm company={companyData} />
        </SettingsLayout>
    );
} 