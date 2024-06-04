import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useCurrentSpace, useCurrentUser } from '@/lib/context';
import { Space, SpaceUserRole } from '@prisma/client';
import { useCreateSpaceUser, useDeleteSpaceUser, useFindManySpaceUser } from '@/zmodel/lib/hooks';
import { UserAvatar } from '../UserAvatar';

export default function ManageMembers() {
    const [email, setEmail] = useState('');
    const space = useCurrentSpace();
    const [role, setRole] = useState<SpaceUserRole>(SpaceUserRole.USER);
    const user = useCurrentUser();
    const { mutateAsync: createMember } = useCreateSpaceUser();
    const { mutate: deleteMember } = useDeleteSpaceUser();

    const { data: members } = useFindManySpaceUser({
        include: {
            user: true,
        },
        orderBy: {
            role: 'desc',
        },
    });

    if (!space) {
        return <></>;
    }
    const inviteUser = async () => {
        try {
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
                    role,
                },
            });
        } catch (err) {
            toast.error('Error occurred');
        }
    };

    const removeMember = (id: string) => {
        // eslint-disable-next-line no-alert
        if (confirm('Are you sure to remove this member from space?')) {
            void deleteMember({ where: { id } });
        }
    };

    return (
        <div>
            <div className="mb-8 flex w-full flex-wrap items-center gap-2">
                <input
                    type="text"
                    placeholder="Type user email and enter to invite"
                    className="input input-sm input-bordered mr-2 grow"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.currentTarget.value);
                    }}
                    onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            void inviteUser();
                        }
                    }}
                />

                <select
                    className="select select-sm mr-2"
                    value={role}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setRole(e.currentTarget.value as SpaceUserRole);
                    }}
                >
                    <option value={SpaceUserRole.USER}>USER</option>
                    <option value={SpaceUserRole.ADMIN}>ADMIN</option>
                </select>

                <button onClick={() => void inviteUser()}>
                    <PlusIcon className="size-6 text-gray-500" />
                </button>
            </div>

            <ul className="space-y-2">
                {members?.map((member) => (
                    <li key={member.id} className="flex w-full flex-wrap justify-between">
                        <div className="flex items-center">
                            <div className="mr-2 hidden md:block">
                                <UserAvatar user={member.user} size={32} />
                            </div>
                            <p className="mr-2 line-clamp-1 w-36 md:w-48">{member.user.name || member.user.email}</p>
                            <p>{member.role}</p>
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
