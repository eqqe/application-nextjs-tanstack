import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { useCurrentUser, useSelectedSpaces } from '@/lib/context';
import { getNewSpace } from '@/lib/getNewSpace';
import { useCreateSpace } from '@/zmodel/lib/hooks';
import { SpaceCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import type { NextPage } from 'next';
import { toast } from 'react-toastify';

export const Home: NextPage = () => {
    const createSpace = useCreateSpace();
    const user = useCurrentUser();
    const { switchSpace } = useSelectedSpaces();
    if (!user) {
        return <></>;
    }
    return (
        <WithNavBar>
            <AutoFormDialog
                formSchema={SpaceCreateScalarSchema}
                onSubmitData={async (data) => {
                    const space = await createSpace.mutateAsync(getNewSpace({ user, name: data.name }));
                    if (space) {
                        toast.success(`${data.name} created successfully!`);
                        switchSpace({ space });
                    } else {
                        toast('Cannot create space');
                    }
                }}
                title={'Create space'}
            />
        </WithNavBar>
    );
};

export default Home;
