import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import propertiesTabs from './properties/tabs';

const folders: Prisma.FolderApplicationVersionCreateWithoutApplicationVersionInput[] = [
    {
        path: '/properties',
        index: 0,
        tabs: {
            create: propertiesTabs,
        },
    },
];

export default folders;
