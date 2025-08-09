import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AddressManagement from './components/AddressManagement';

async function AddressesPage() {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return redirect('/auth/login');
    }

    return <AddressManagement userId={user.id} />;
}

export default AddressesPage; 