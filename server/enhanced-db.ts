import { enhance } from '@zenstackhq/runtime';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from './auth';
import { prisma } from './db';
import { CurrentSpaceIdsCookie, currentSpaceIdsCookieName } from '@/components/layout/SpaceSwitch';

export function enhancePrisma({
    userId,
    createSpaceId,
    currentSpaceIds,
}: {
    userId?: string;
    createSpaceId?: string;
    currentSpaceIds?: string[];
}) {
    let options;
    if (createSpaceId && currentSpaceIds) {
        options = { user: { id: userId, createSpaceId, currentSpaceIds } };
    } else if (userId) {
        options = { user: { id: userId } };
    } else {
        options = {};
    }
    // @ts-ignore
    return enhance(prisma, options);
}

export async function getEnhancedPrisma(ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) {
    const session = await getServerAuthSession(ctx);
    let currentSpaceIdsCookie: CurrentSpaceIdsCookie = [];
    if (session?.user) {
        const cookieName = currentSpaceIdsCookieName(session.user.id);
        const currentSpaceIdsCookieRaw = ctx.req.cookies[cookieName];
        if (currentSpaceIdsCookieRaw) {
            try {
                currentSpaceIdsCookie = JSON.parse(currentSpaceIdsCookieRaw);
            } catch {}
        }
    }
    return enhancePrisma({
        userId: session?.user.id,
        currentSpaceIds: currentSpaceIdsCookie.map((c) => c.spaceId),
        createSpaceId: currentSpaceIdsCookie.find((c) => c.create)?.spaceId,
    });
}
