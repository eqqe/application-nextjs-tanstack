import { enhance } from '@zenstackhq/runtime';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from './auth';
import { SelectedSpaces, selectedSpacesCookieName } from '@/lib/context';

export function enhancePrisma({ userId, selectedSpaces }: { userId?: string; selectedSpaces?: SelectedSpaces }) {
    let options;
    if (userId) {
        options = {
            user: {
                id: userId,
                selectedSpaces: selectedSpaces ?? [],
                createSpaceId: selectedSpaces?.length ? selectedSpaces[0] : [],
            },
        };
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
    let selectedSpaces: SelectedSpaces | undefined;
    if (session?.user) {
        const cookieName = selectedSpacesCookieName(session.user.id);
        const selectedSpacesCookieRaw = ctx.req.cookies[cookieName];
        if (selectedSpacesCookieRaw) {
            try {
                selectedSpaces = JSON.parse(selectedSpacesCookieRaw);
            } catch {}
        }
    }
    return enhancePrisma({
        userId: session?.user.id,
        selectedSpaces,
    });
}
