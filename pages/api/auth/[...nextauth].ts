import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getNewSpace } from '@/lib/getNewSpace';
import NextAuth, { User } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from 'server/db';
import { signInPath } from '@/components/AuthGuard';
import { Provider } from 'next-auth/providers';
import { testUser } from '@/lib/testUser';

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
    providers.push(
        CredentialsProvider({
            credentials: {},
            authorize: authorize(),
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

    events: {
        async signIn({ user }: { user: User }) {
            const spaceCount = await prisma.spaceUser.count({
                where: {
                    userId: user.id,
                },
            });
            if (spaceCount > 0) {
                return;
            }
            await prisma.space.create(getNewSpace({ user, name: `${user.name || user.email}'s space` }));
        },
    },
};

/* Only for development use */
function authorize() {
    return async () => {
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
    };
}

export default NextAuth(authOptions);
