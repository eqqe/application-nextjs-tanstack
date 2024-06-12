import { GridElementType } from '@prisma/client';
import { Type, Prisma, TypeTableRequest } from '@prisma/client';

export const assetsv0_1: Prisma.ApplicationVersionCreateWithoutApplicationInput = {
    versionMajor: 0,
    versionMinor: 1,
    folders: {
        create: [
            {
                path: '/properties',
                tabs: {
                    create: {
                        subTabs: {
                            create: {
                                name: 'Properties subTab',
                                grids: {
                                    create: [
                                        {
                                            name: 'Properties grid',
                                            columns: 1,
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        card: {
                                                            create: {
                                                                title: 'Your properties v0.1',
                                                                titleXl: 4,
                                                                description: 'Table',
                                                                headerPb: 2,
                                                                content: 'Listed here',
                                                                invertTitleDescription: true,
                                                                table: {
                                                                    create: {
                                                                        type: Type.Property,
                                                                        typeTableRequest: TypeTableRequest.FindMany,
                                                                        columns: ['address', 'propertyType'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
};
