import { ProfileRole } from '@prisma/client';
import { User } from 'next-auth';
export function getNewSpace({ user, name }: { user: User; name: string }) {
    return {
        data: {
            name,
            profiles: {
                create: {
                    role: ProfileRole.ADMIN,
                    users: {
                        create: {
                            user: {
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
