import { SpaceUserRole } from '@prisma/client';
import { User } from 'next-auth';
import { v4 as uuid } from 'uuid';
export function getNewSpace({ user, name }: { user: User; name: string }) {
    const spaceId = uuid();
    return {
        data: {
            id: spaceId,
            name,
            owner: {
                connect: {
                    id: user.id,
                },
            },
            members: {
                create: {
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    profile: {
                        create: {
                            role: SpaceUserRole.ADMIN,
                            spaceId: spaceId,
                        },
                    },
                },
            },
        },
    };
}
