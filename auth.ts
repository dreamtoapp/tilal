import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { getAccountById, getUserById } from './app/(e-comm)/(adminPage)/auth/action';
import authConfig from './auth.config';
import db from './lib/prisma';
import { getNextAuthURL } from './lib/auth-dynamic-config';

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  basePath: '/api/auth',
  // Dynamic URL configuration for Vercel deployments
  ...(process.env.NODE_ENV === 'production' && {
    url: getNextAuthURL(),
  }),
  ...authConfig,
  callbacks: {
    async jwt({ token, trigger }) {
      if (trigger === 'update' && token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.name = existingUser.name;
          token.email = existingUser.email;
          token.image = existingUser.image;
          token.phone = existingUser.phone;
          token.role = existingUser.role;
        }
        return token;
      }

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existAccuount = await getAccountById(existingUser.id);

      token.isOauth = !!existAccuount;
      token.id = existingUser.id;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.phone = existingUser.phone;
      token.image = existingUser.image;
      token.isOtp = existingUser.isOtp;

      return token;
    },
    async session({ token, session }: { token: any; session: any }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string | undefined,
          role: token.role as string | undefined,
          name: token.name as string | null | undefined,
          email: token.email as string | null | undefined,
          phone: token.phone as string | undefined,
          image: token.image as string | undefined,
          isOtp: token.isOtp as boolean | undefined,
          isOauth: token.isOauth as boolean | undefined,
        },
      };
    },
  },
});
