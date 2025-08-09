import LoginPe from './component/login-from';
import { PageProps } from '@/types/commonTypes';

export default async function LoginPage({ searchParams }: PageProps<Record<string, never>, { redirect?: string }>) {
  const resolvedSearchParams = await searchParams;
  return <LoginPe redirect={resolvedSearchParams?.redirect || '/'} />;
}
