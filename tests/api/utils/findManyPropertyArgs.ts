import { Prisma } from '@prisma/client';

export const findManyPropertyArgs = {
    orderBy: { private: Prisma.SortOrder.desc },
};
