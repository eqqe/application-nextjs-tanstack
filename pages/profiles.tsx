import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import AutoForm from '@/components/ui/auto-form';
import { ProfileUpdateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { toast } from 'react-toastify';
import { orderByCreatedAt } from '@/lib/utils';
import { trpc } from '@/lib/trpc';

export const Profiles: NextPage = () => {
    const { data: profiles } = trpc.profile.findMany.useQuery(orderByCreatedAt);
    const update = trpc.profile.update.useMutation();
    return (
        <WithNavBar>
            {profiles?.map((profile) => (
                <AutoForm
                    key={profile.id}
                    formSchema={ProfileUpdateScalarSchema}
                    values={profile}
                    onSubmit={async (data) => {
                        try {
                            await update.mutateAsync({ data, where: { id: profile.id } });
                            toast.success(`Profile updated successfully!`);
                        } catch {
                            toast.success(`Cannot update user!`);
                        }
                    }}
                />
            ))}
        </WithNavBar>
    );
};

export default Profiles;
