import Header from '@/components/layout/header';
import { ReactNode, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, Settings } from 'lucide-react';
import Link from 'next/link';
import { useNavItems } from '@/hooks/useNavItems';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from './FallbackError';
import { useFindManySpace } from '@/zmodel/lib/hooks';
import { getCookie, setCookie } from 'cookies-next';
import { currentSpaceCookieName } from './SpaceSwitch';
import { useCurrentUser } from '@/lib/context';
import { useRouter } from 'next/router';

type Props = {
    children: ReactNode | ReactNode[] | undefined;
};

export function WithNavBar({ children }: Props) {
    const { data: spaces } = useFindManySpace();
    const user = useCurrentUser();

    const [cookieExists, setCookieExists] = useState(false);

    const router = useRouter();
    useEffect(() => {
        if (!cookieExists) {
            if (user?.id) {
                const cookieName = currentSpaceCookieName(user?.id);
                const currentSpaceId = getCookie(cookieName);
                if (currentSpaceId) {
                    setCookieExists(true);
                    return;
                } else if (spaces) {
                    if (spaces.length) {
                        const firstSpace = spaces[0];
                        setCookieExists(true);
                        setCookie(cookieName, firstSpace.id);
                    } else {
                        router.push('/signin');
                    }
                }
            } else {
                router.push('/signin');
            }
        }
    }, [cookieExists, router, spaces, user?.id]);

    const items = useNavItems();
    return (
        <ErrorBoundary fallback={<FallbackError />}>
            <div className="bg-muted/40 flex min-h-screen w-full flex-col">
                <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
                    <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                        {items?.map((item, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:size-8"
                                    >
                                        <Package className="size-5" />
                                        <span className="sr-only">{item.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.title}</TooltipContent>
                            </Tooltip>
                        ))}
                    </nav>
                    <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/settings"
                                    className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:size-8"
                                >
                                    <Settings className="size-5" />
                                    <span className="sr-only">Settings</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    </nav>
                </aside>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <ErrorBoundary fallback={<FallbackError />}>
                        <Header />
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<FallbackError />}>
                        <main className="p-6">{children}</main>
                    </ErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
}
