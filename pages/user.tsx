import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import AutoForm from '@/components/ui/auto-form';
import { UserUpdateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { useCurrentUser } from '@/lib/context';
import { useUpdateUser } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';

export const User: NextPage = () => {
    const user = useCurrentUser();
    const update = useUpdateUser();
    return (
        <WithNavBar>
            <AutoForm
                formSchema={UserUpdateScalarSchema.omit({
                    password: true,
                    selectedSpaces: true,
                    createSpaceId: true,
                    emailVerified: true,
                })}
                values={user}
                onSubmit={async (data) => {
                    try {
                        await update.mutateAsync({ data, where: { id: user?.id } });
                        toast.success(`User updated successfully!`);
                    } catch {
                        toast.success(`Cannot update user!`);
                    }
                }}
            />
        </WithNavBar>
    );
};

export default User;
