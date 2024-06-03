import { Button } from '@/components/ui/button';
import { Cloud, PlusCircle, IceCreamIcon, EyeIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../layout/FallbackError';
import { useFindManySpace } from '@/zmodel/lib/hooks';
import { useRouter } from 'next/navigation';
import { useSpaceSlug } from '@/lib/context';
import { Badge } from '@/components/ui/badge';

export const localStorageSpace = 'currentSpaceSlug';
export function SpaceSwitch() {
    const { data: spaces } = useFindManySpace();

    const currentSpaceSlug = useSpaceSlug();

    const router = useRouter();
    function switchSpace(slug: string) {
        if (global?.window !== undefined) {
            localStorage.setItem(localStorageSpace, slug);
        }
        router.refresh();
    }

    return (
        <ErrorBoundary fallback={<FallbackError />}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-9 px-0 focus-visible:ring-0">
                        <Cloud className="size-[1.2rem] rotate-0 scale-100" />
                        <span className="sr-only">Select space</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-15 mr-3 mt-2">
                    <DropdownMenuLabel>Switch space</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => switchSpace('')}>
                            <EyeIcon className="mr-2 size-4" />
                            {!currentSpaceSlug ? <Badge variant={'outline'}>See all content</Badge> : 'See all content'}
                        </DropdownMenuItem>
                        {spaces?.map(({ slug, name }) => (
                            <DropdownMenuItem key={slug} onClick={() => switchSpace(slug)}>
                                <IceCreamIcon className="mr-2 size-4" />
                                {slug === currentSpaceSlug ? <Badge variant={'outline'}>{name}</Badge> : name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/s/n')}>
                        <PlusCircle className="mr-2 size-4" />
                        <span>Create space</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </ErrorBoundary>
    );
}
