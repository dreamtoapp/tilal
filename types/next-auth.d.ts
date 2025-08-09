import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }
  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    image?: string | null;
    isOauth: boolean;
    isOtp: boolean;
  }
}
