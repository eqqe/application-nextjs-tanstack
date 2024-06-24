import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { WithNavBar } from '@/components/layout/WithNavBar';
import AutoForm from '@/components/ui/auto-form';
import { useCurrentSessionUser, useSelectedSpaces } from '@/lib/context';
import { getNewSpace } from '@/lib/getNewSpace';
import { trpc } from '@/lib/trpc';
import { SpaceCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import type { NextPage } from 'next';
import { toast } from 'react-toastify';

export const Home: NextPage = () => {
    const createSpace = trpc.space.create.useMutation();
    const user = useCurrentSessionUser();
    const { switchSpace } = useSelectedSpaces();
    if (!user) {
        return <></>;
    }
    return (
        <WithNavBar>
            <AutoForm
                formSchema={SpaceCreateScalarSchema}
                onSubmit={async (data) => {
                    const space = await createSpace.mutateAsync(getNewSpace({ user, name: data.name }));
                    if (space) {
                        toast.success(`${data.name} created successfully!`);
                        switchSpace({ space });
                    } else {
                        toast('Cannot create space');
                    }
                }}
            />
        </WithNavBar>
    );
};

export default Home;
