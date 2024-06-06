import { CreateForm } from '@/components/Form/CreateForm';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { useCurrentUser } from '@/lib/context';
import { getNewSpace } from '@/lib/getNewSpace';
import { useSwitchSpace } from '@/lib/switchSpace';
import { useCreateSpace } from '@/zmodel/lib/hooks';
import { SpaceCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import type { NextPage } from 'next';
import { toast } from 'react-toastify';

export const Home: NextPage = () => {
    const createSpace = useCreateSpace();
    const user = useCurrentUser();
    const switchSpace = useSwitchSpace();
    if (!user) {
        return <></>;
    }
    return (
        <WithNavBar>
            <CreateForm
                formSchema={SpaceCreateScalarSchema}
                onSubmitData={async (data) => {
                    const space = await createSpace.mutateAsync(getNewSpace({ user, name: data.name }));
                    if (space) {
                        toast.success(`${data.name} created successfully!`);
                        switchSpace(space);
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
