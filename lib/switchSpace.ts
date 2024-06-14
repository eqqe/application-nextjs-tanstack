import { currentSpaceIdsCookieName } from '@/components/layout/SpaceSwitch';
import { useQueryClient } from '@tanstack/react-query';
import { Space } from '@zenstackhq/runtime/models';
import { setCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { useCurrentUser } from './context';

export function useSwitchSpace() {
    const currentUser = useCurrentUser();

    const queryClient = useQueryClient();
    return (space: Space) => {
        if (currentUser) {
            setCookie(currentSpaceIdsCookieName(currentUser.id), space.id);
            queryClient.refetchQueries({ queryKey: ['zenstack'] });
        } else {
            toast('Error cannot find current user');
        }
    };
}
