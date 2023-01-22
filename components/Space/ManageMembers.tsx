import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCurrentSpace, useCurrentUser } from '@/lib/context';
import { Profile } from '@prisma/client';
import { useCreateSpaceUser, useDeleteSpaceUser, useFindManySpaceUser, useFindManyProfile } from '@/zmodel/lib/hooks';
import { UserAvatar } from '../UserAvatar';
import { CreateForm } from '../Form/CreateForm';
import { SpaceUserCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';

export default function ManageMembers() {
    const [email, setEmail] = useState('');
    const space = useCurrentSpace();
    const [profile, setProfile] = useState<Profile>();
    const user = useCurrentUser();
    const { mutateAsync: createMember } = useCreateSpaceUser();
    const { mutate: deleteMember } = useDeleteSpaceUser();

    const { data: members } = useFindManySpaceUser({
        include: {
            user: true,
            profile: true,
        },
        orderBy: {
            profile: {
                role: 'desc',
            },
        },
    });
    const { data: profiles } = useFindManyProfile();

    if (!space || !profiles?.length) {
        return <></>;
    }

    const removeMember = (id: string) => {
        // eslint-disable-next-line no-alert
        if (confirm('Are you sure to remove this member from space?')) {
            void deleteMember({ where: { id } });
        }
    };

    return (
        <div>
            <CreateForm
                formSchema={z.object({
                    spaceUser: SpaceUserCreateScalarSchema,
                    // https://stackoverflow.com/a/73825370/7671079 first element must be defined explicitely
                    profile: z.enum([profiles[0].id, ...profiles.slice(1).map((profile) => profile.id)]),
                })}
                onSubmitData={async (data) => {
                    await createMember({
                        data: {
                            user: {
                                connect: {
                                    email,
                                },
                            },
                            space: {
                                connect: {
                                    id: space.id,
                                },
                            },
                            profile: {
                                connect: {
                                    id: data.profile,
                                },
                            },
                        },
                    });
                    toast.success(`${email} added successfully!`);
                }}
                title={'Add member List'}
            />

            <ul className="space-y-2">
                {members?.map((member) => (
                    <li key={member.id} className="flex w-full flex-wrap justify-between">
                        <div className="flex items-center">
                            <div className="mr-2 hidden md:block">
                                <UserAvatar user={member.user} size={32} />
                            </div>
                            <p className="mr-2 line-clamp-1 w-36 md:w-48">{member.user.name || member.user.email}</p>
                            <p>{member.profile.role}</p>
                        </div>
                        <div className="flex items-center">
                            {user?.id !== member.user.id && (
                                <TrashIcon
                                    className="size-4 text-gray-500"
                                    onClick={() => {
                                        removeMember(member.id);
                                    }}
                                />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
