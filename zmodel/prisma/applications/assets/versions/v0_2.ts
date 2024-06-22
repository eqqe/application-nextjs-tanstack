import { GridElementType } from '@prisma/client';
import { Type, Prisma, TypeTableRequest } from '@prisma/client';
import { PropertyColumns, LeaseColumns } from '../columns';

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
                                name: 'Properties',
                                grids: {
                                    create: [
                                        {
                                            name: 'Your essential data',
                                            columns: 4,
                                            icon: 'Home',
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenants`,
                                                                count: 'PropertyTenancy',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create property tenant',
                                                                                table: 'PropertyTenancy',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your leases',
                                                                invertTitleDescription: false,
                                                                description: `leases`,
                                                                count: 'Lease',
                                                                icon: 'FolderKey',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create lease',
                                                                                table: 'Lease',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your properties',
                                                                invertTitleDescription: false,
                                                                description: `properties`,
                                                                count: 'Property',
                                                                icon: 'Home',
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
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your lease tenants',
                                                                invertTitleDescription: false,
                                                                description: `lease tenants`,
                                                                count: 'LeaseTenant',
                                                                icon: 'Users',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease Tenant',
                                                                                table: 'LeaseTenant',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your stats on leases',
                                                                invertTitleDescription: false,
                                                                description: `lease stats`,
                                                                table: {
                                                                    create: {
                                                                        groupBy: {
                                                                            create: {
                                                                                fields: [LeaseColumns.type],
                                                                                count: [LeaseColumns.id],
                                                                            },
                                                                        },
                                                                        chart: {
                                                                            create: {
                                                                                type: 'PieChart',
                                                                            },
                                                                        },
                                                                        type: 'Lease',
                                                                        typeTableRequest: 'GroupBy',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Surface of properties by city',
                                                                invertTitleDescription: false,
                                                                description: `surface by city`,
                                                                table: {
                                                                    create: {
                                                                        groupBy: {
                                                                            create: {
                                                                                fields: [PropertyColumns.city],
                                                                                sum: [PropertyColumns.surface],
                                                                            },
                                                                        },
                                                                        chart: {
                                                                            create: {
                                                                                type: 'PieChart',
                                                                            },
                                                                        },
                                                                        type: 'Property',
                                                                        typeTableRequest: 'GroupBy',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'Properties',
                                            columns: 6,
                                            icon: 'FolderKey',
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
                                                                                                                PropertyColumns.city,
                                                                                                            ],
                                                                                                            sum: [
                                                                                                                PropertyColumns.surface,
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
                                                                                                        PropertyColumns.streetAddress,
                                                                                                        PropertyColumns.city,
                                                                                                        PropertyColumns.postalCode,
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
                                            name: 'Associates',
                                            columns: 4,
                                            icon: 'Users',
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
                                                                        type: 'PropertyTenancyInCommonTenant',
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
