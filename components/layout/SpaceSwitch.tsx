import { Button } from '@/components/ui/button';
import { Cloud, PlusCircle, IceCreamIcon } from 'lucide-react';
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
import { useSelectedSpaces } from '@/lib/context';
import { Badge } from '@/components/ui/badge';

export function SpaceSwitch() {
    const { data: spaces } = useFindManySpace();

    const router = useRouter();

    const { selectedSpaces, switchSpace } = useSelectedSpaces();

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
                        {spaces?.map((space) => (
                            <DropdownMenuItem key={space.id} onClick={() => switchSpace({ space })}>
                                <IceCreamIcon className="mr-2 size-4" />
                                {space.id === selectedSpaces[0] ? (
                                    <Badge variant={'outline'}>{space.name}</Badge>
                                ) : (
                                    space.name
                                )}
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
