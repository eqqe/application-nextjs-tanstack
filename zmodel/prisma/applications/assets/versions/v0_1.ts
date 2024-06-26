import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import { PropertyColumns } from '../columns';

export const assetsv0_1: Prisma.ApplicationVersionCreateWithoutApplicationInput = {
    versionMajor: 0,
    versionMinor: 1,
    folders: {
        create: [
            {
                index: 0,
                path: '/properties',
                tabs: {
                    create: {
                        index: 0,
                        subTabs: {
                            create: {
                                index: 0,
                                name: 'Properties subTab',
                                grids: {
                                    create: [
                                        {
                                            index: 0,
                                            name: 'List of properties',
                                            elements: {
                                                create: [
                                                    {
                                                        index: 0,
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
                                                                        type: Type.property,
                                                                        typeTableRequest: TypeTableRequest.findMany,
                                                                        columns: [
                                                                            PropertyColumns.streetAddress,
                                                                            PropertyColumns.propertyType,
                                                                        ],
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
