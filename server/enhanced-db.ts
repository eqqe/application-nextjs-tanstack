import { enhance } from '@zenstackhq/runtime';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from './auth';
import { prisma } from './db';
import { currentSpaceCookieName } from '@/components/layout/SpaceSwitch';

export async function getEnhancedPrisma(ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) {
    const session = await getServerAuthSession(ctx);
    let user;
    if (session?.user) {
        const cookieName = currentSpaceCookieName(session.user.id);
        const currentSpaceId = ctx.req.cookies[cookieName];
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
