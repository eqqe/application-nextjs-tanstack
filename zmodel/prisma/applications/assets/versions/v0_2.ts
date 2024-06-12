import { GridElementType } from '@prisma/client';
import { Type, Prisma, TypeTableRequest } from '@prisma/client';

export const assetsv0_2: Prisma.ApplicationVersionCreateWithoutApplicationInput = {
    versionMajor: 0,
    versionMinor: 2,
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
                                            name: 'Properties Grid',
                                            columns: 6,
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your Orders',
                                                                invertTitleDescription: false,
                                                                description: `Introducing Our Dynamic Orders Dashboard for Seamless
                                        Management and Insightful Analysis.`,
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Property',
                                                                                table: 'Property',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        card: {
                                                            create: {
                                                                title: '$1,329',
                                                                titleXl: 4,
                                                                description: 'This Week',
                                                                content: '+25% from last week',
                                                                invertTitleDescription: true,
                                                                headerPb: 2,
                                                                footer: {
                                                                    create: {
                                                                        progress: {
                                                                            create: {
                                                                                value: 25,
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        card: {
                                                            create: {
                                                                title: '$5,329',
                                                                titleXl: 4,
                                                                description: 'This Month',
                                                                content: '+10% from last month',
                                                                invertTitleDescription: true,
                                                                headerPb: 2,
                                                                footer: {
                                                                    create: {
                                                                        progress: {
                                                                            create: {
                                                                                value: 12,
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Tabs,
                                                        colSpan: 4,
                                                        tabs: {
                                                            create: {
                                                                tabsContent: {
                                                                    create: [
                                                                        {
                                                                            name: 'Week',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your properties',
                                                                                            titleXl: 4,
                                                                                            description: 'Table',
                                                                                            headerPb: 2,
                                                                                            content: 'Listed here',
                                                                                            invertTitleDescription:
                                                                                                true,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: Type.Property,
                                                                                                    typeTableRequest:
                                                                                                        TypeTableRequest.GroupBy,
                                                                                                    groupBy: {
                                                                                                        create: {
                                                                                                            fields: [
                                                                                                                'city',
                                                                                                            ],
                                                                                                            sum: [
                                                                                                                'surface',
                                                                                                            ],
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Month',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your properties',
                                                                                            titleXl: 4,
                                                                                            description: 'Table',
                                                                                            headerPb: 2,
                                                                                            content: 'Listed here',
                                                                                            invertTitleDescription:
                                                                                                true,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: Type.Property,
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                    columns: [
                                                                                                        'address',
                                                                                                        'city',
                                                                                                        'postalCode',
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Year',
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'Associates grid',
                                            columns: 4,
                                            elements: {
                                                create: [
                                                    {
                                                        type: 'Card',
                                                        colSpan: 4,
                                                        card: {
                                                            create: {
                                                                title: 'Associates',
                                                                description:
                                                                    'List associates in the real estate company',
                                                                table: {
                                                                    create: {
                                                                        typeTableRequest: 'FindMany',
                                                                        type: 'Associate',
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
