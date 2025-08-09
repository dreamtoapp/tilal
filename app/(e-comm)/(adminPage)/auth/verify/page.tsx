import { auth } from '@/auth';
import OtpForm from './component/OtpForm';

export default async function VerifyPage() {
  const seisson = await auth();

  if (!seisson) {
    return (
      <div className="min-h-screen bg-background">
        <OtpForm phone={""} />
      </div>
    );
  }

  const userData = {
    phone: seisson?.user?.phone,
  };

  return (
    <div className="min-h-screen bg-background">
      <OtpForm phone={userData.phone} />
    </div>
  );
}
