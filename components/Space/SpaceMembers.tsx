import { useCurrentSpace } from '@/lib/context';
import { useFindManySpaceUser } from '@/zmodel/lib/hooks';
import { Space } from '@prisma/client';
import ManageMembers from './ManageMembers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../layout/FallbackError';

function ManagementDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Manage members</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage members</DialogTitle>
                </DialogHeader>
                <ErrorBoundary fallback={<FallbackError />}>
                    <ManageMembers />
                </ErrorBoundary>
            </DialogContent>
        </Dialog>
    );
}

export function SpaceMembers() {
    return <div className="flex items-center">{ManagementDialog()}</div>;
}
