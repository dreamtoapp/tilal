import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import db from './lib/prisma';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { phone, password } = credentials as {
          phone: string;
          password: string;
        };

        if (!phone || !password) {
          throw new Error('Invalid credentials');
        }

        const user = await db.user.findFirst({
          where: { phone },
        });

        if (!user) throw new Error('User not found');
        if (user.password !== password) throw new Error('Invalid password');

        // Coerce required fields to string (never null)
        return {
          ...user,
          id: user.id || '',
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || '',
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
