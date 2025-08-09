import AboutAdminClient from './components/AboutAdminClient';
import { getAboutPageContent } from '@/app/(e-comm)/(adminPage)/about/actions/getAboutPageContent';

export default async function AboutAdminPage() {
    const aboutPage = await getAboutPageContent();
    return <AboutAdminClient aboutPage={aboutPage} />;
} 