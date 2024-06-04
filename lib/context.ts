import { useFindManySpace } from '@/zmodel/lib/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { currentSpaceCookieName } from '@/components/layout/SpaceSwitch';

export function useCurrentUser() {
    const { data: session } = useSession();
    return session?.user;
}
export function useCurrentSpace() {
    const { data: spaces } = useFindManySpace();
    if (!spaces) {
        return;
    }

    const currentSpaceId = getCookie(currentSpaceCookieName);
    if (currentSpaceId) {
        return spaces.find((space) => space.id === currentSpaceId);
    } else {
        if (spaces?.length) {
            const firstSpace = spaces[0];
            setCookie(currentSpaceCookieName, firstSpace.id);
            return spaces[0];
        }
        throw 'Cannot find space';
    }
}

export function useComponentIdRouter() {
    const router = useRouter();
    const componentId = router.query.componentId;
    if (typeof componentId === 'string') {
        return componentId;
    }
}
