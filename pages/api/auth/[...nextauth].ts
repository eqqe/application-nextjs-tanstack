import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { User } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from 'server/db/client';
import { signInPath } from '@/components/AuthGuard';
import { Provider } from 'next-auth/providers';
import { testUser } from '@/lib/demo/testUser';

const providers: Provider[] = [
    EmailProvider({
        server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        },
    }),
];

if (process.env.NODE_ENV === 'development') {
    /* Only for development use */
    providers.push(
        CredentialsProvider({
            credentials: {},
            authorize: async () => {
                const maybeUser = await prisma.user.findUnique({
                    where: {
                        email: testUser.email,
                    },
                    select: {
                        id: true,
                    },
                });

                if (!maybeUser) {
                    return null;
                }

                return {
                    id: maybeUser.id,
                    email: testUser.email,
                };
            },
        })
    );
}
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: signInPath,
    },

    providers,

    callbacks: {
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub!,
                },
            };
        },

        async signIn({ user }) {
            if (!user.email) {
                return signInPath;
            }
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: user.email,
                },
            });
            if (existingUser) {
                return true;
            }
            return signInPath;
        },
    },
};

export default NextAuth(authOptions);
