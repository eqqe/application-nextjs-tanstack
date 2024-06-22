import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { useFindManyProfile, useUpdateProfile } from '@/zmodel/lib/hooks';
import AutoForm from '@/components/ui/auto-form';
import { ProfileUpdateScalarSchema, UserScalarSchema } from '@zenstackhq/runtime/zod/models';
import { toast } from 'react-toastify';
import { z } from 'zod';

export const Profiles: NextPage = () => {
    const { data: profilesUserNested } = useFindManyProfile({
        include: {
            spaces: true,
            users: {
                include: {
                    user: true,
                },
            },
        },
    });
    const profiles = profilesUserNested?.map((profileUserNested) => ({
        ...profileUserNested,
        users: profileUserNested.users.flatMap((userRelation) => userRelation.user),
    }));
    const update = useUpdateProfile();
    return (
        <WithNavBar>
            {profiles?.map((profile) => (
                <AutoForm
                    key={profile.id}
                    formSchema={ProfileUpdateScalarSchema.extend({
                        users: z.array(UserScalarSchema.pick({ email: true })),
                    })}
                    values={profile}
                    onSubmit={async (data) => {
                        try {
                            // TODO SRE
                            await update.mutateAsync({ data: {}, where: { id: profile.id } });
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
