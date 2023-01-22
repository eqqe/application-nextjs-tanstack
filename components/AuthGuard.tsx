import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

type Props = {
    children: ReactElement | ReactElement[];
};
export const signInPath = '/signin';
export default function AuthGuard({ children }: Props) {
    const { status } = useSession();
    const router = useRouter();

    if (router.pathname === signInPath) {
        return <>{children}</>;
    }

    if (status === 'loading') {
        return <p>Loading...</p>;
    } else if (status === 'unauthenticated') {
        void router.push(signInPath);
        return <></>;
    }
    return <>{children}</>;
}
