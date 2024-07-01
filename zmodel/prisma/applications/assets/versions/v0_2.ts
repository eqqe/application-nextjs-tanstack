import { type Prisma } from '@prisma/client';
import folders from './v0_2/folders';

export const assetsv0_2: Prisma.ApplicationVersionCreateWithoutApplicationInput = {
    versionMajor: 0,
    versionMinor: 2,
    folders: {
        create: folders,
    },
};
