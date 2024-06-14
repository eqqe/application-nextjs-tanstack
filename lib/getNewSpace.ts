import { SpaceUserRole } from '@prisma/client';
import { User } from 'next-auth';
export function getNewSpace({ user, name }: { user: User; name: string }) {
    return {
        data: {
            name,
            owner: {
                connect: {
                    id: user.id,
                },
            },
            profiles: {
                create: {
                    profile: {
                        create: {
                            role: SpaceUserRole.ADMIN,
                            users: {
                                connect: {
                                    id: user.id,
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}
