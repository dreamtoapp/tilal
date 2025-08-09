import RegisterForm from './components/register-form';
import { PageProps } from '@/types/commonTypes';

export default async function RegisterPage({ searchParams }: PageProps<Record<string, never>, { redirect?: string }>) {
  const resolvedSearchParams = await searchParams;
  return <RegisterForm redirect={resolvedSearchParams?.redirect || '/'} />;
}
