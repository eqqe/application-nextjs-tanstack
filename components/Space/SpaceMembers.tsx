import { PlusIcon } from '@heroicons/react/24/outline';
import { useCurrentSpace } from '@/lib/context';
import { useFindManySpaceUser } from '@/zmodel/lib/hooks';
import { Space } from '@prisma/client';
import ManageMembers from './ManageMembers';
import { UserAvatar } from '../UserAvatar';
import { toast } from 'react-toastify';
import AutoForm from '@/components/ui/auto-form';
import { z } from 'zod';
import { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../layout/FallbackError';

function ManagementDialog(space?: Space) {
    if (!space) {
        return void 0;
    }
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
    const space = useCurrentSpace();

    const { data: members } = useFindManySpaceUser(
        {
            where: {
                spaceId: space?.id,
            },
            include: {
                user: true,
            },
            orderBy: {
                role: 'desc',
            },
        },
        { enabled: !!space }
    );

    return <div className="flex items-center">{ManagementDialog(space)}</div>;
}
