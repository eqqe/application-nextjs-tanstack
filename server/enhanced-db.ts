import { enhance } from '@zenstackhq/runtime';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from './auth';
import { prisma } from './db';

export async function getEnhancedPrisma(ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) {
    const session = await getServerAuthSession(ctx);
    let user;
    if (session?.user) {
        const currentSpaceId = ctx.req.cookies['currentSpaceId'];
        if (currentSpaceId) {
            user = { ...session?.user, currentSpace: { id: currentSpaceId }, currentSpaceId: currentSpaceId };
        } else {
            user = session.user;
        }
    }
    // @ts-ignore
    return enhance(prisma, {
        user,
    });
}
