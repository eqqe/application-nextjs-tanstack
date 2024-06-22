import { GridElementType } from '@prisma/client';
import { Type, Prisma, TypeTableRequest } from '@prisma/client';
import { PropertyColumns, LeaseColumns, PropertyTenancyInCommonScalarSchemaColumns } from '../columns';

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
                                            name: 'Properties',
                                            columns: 6,
                                            icon: 'Home',
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Properties',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
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
                                                                title: '129 000 €',
                                                                titleXl: 4,
                                                                description: 'This Week',
                                                                content: '+5% from last week',
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
                                                                title: '516 000',
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
                                                                            name: 'All',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your properties',
                                                                                            titleXl: 2,
                                                                                            description: 'Table',
                                                                                            headerPb: 2,
                                                                                            content: 'Listed here',
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
                                                                            name: 'Surface',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'By surface',
                                                                                            titleXl: 2,
                                                                                            description: 'Table',
                                                                                            headerPb: 2,
                                                                                            content: 'Listed here',
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
                                                                            name: 'Type',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Graph of property by type',
                                                                                            titleXl: 2,
                                                                                            description: 'See below',
                                                                                            headerPb: 2,
                                                                                            content: 'Property by type',
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: Type.Property,
                                                                                                    typeTableRequest:
                                                                                                        TypeTableRequest.GroupBy,
                                                                                                    chart: {
                                                                                                        create: {
                                                                                                            type: 'PieChart',
                                                                                                        },
                                                                                                    },
                                                                                                    groupBy: {
                                                                                                        create: {
                                                                                                            fields: [
                                                                                                                PropertyColumns.propertyType,
                                                                                                            ],
                                                                                                            count: [
                                                                                                                PropertyColumns.propertyType,
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
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'Property Tenancies',
                                            columns: 4,
                                            icon: 'SquareUser',
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Property Tenancy',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Property Tenancy',
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
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your joint property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyJointTenancy',
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your in common property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyTenancyInCommon',
                                                            },
                                                        },
                                                    },
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your by entirety property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyTenancyByEntirety',
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
                                                                            name: 'Common',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Property Tenancies in common',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'PropertyTenancyInCommon',
                                                                                                    columns: [
                                                                                                        PropertyTenancyInCommonScalarSchemaColumns.city,
                                                                                                        PropertyTenancyInCommonScalarSchemaColumns.intraCommunityVAT,
                                                                                                        PropertyTenancyInCommonScalarSchemaColumns.postalCode,
                                                                                                        PropertyTenancyInCommonScalarSchemaColumns.updatedAt,
                                                                                                    ],
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Joint',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Joint Property Tenancies',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'PropertyJointTenancy',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'By entirety',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your by entirety Property Tenancies',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'PropertyTenancyByEntirety',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Tenants In Common',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Tenants in Common',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'PropertyTenancyInCommonTenant',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'All',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Property Tenancies',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'PropertyTenancy',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
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
                                            name: 'Leases',
                                            columns: 4,
                                            icon: 'FolderKey',
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Leases',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
                                                                count: 'Lease',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease',
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
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Tenants',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
                                                                count: 'LeaseTenant',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease Tenants',
                                                                                table: 'LeaseTenant',
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
                                                                            name: 'Leases',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Leases',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'Lease',
                                                                                                    columns: [],
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Tenants',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Lease tenants',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'LeaseTenant',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
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
                                            name: 'Leases',
                                            columns: 4,
                                            icon: 'FolderKey',
                                            elements: {
                                                create: [
                                                    {
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Leases',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
                                                                count: 'Lease',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease',
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
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Tenants',
                                                                invertTitleDescription: false,
                                                                description: `Click here to add one`,
                                                                count: 'LeaseTenant',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease Tenants',
                                                                                table: 'LeaseTenant',
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
                                                                            name: 'Leases',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Leases',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'Lease',
                                                                                                    columns: [],
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'Tenants',
                                                                            elements: {
                                                                                create: {
                                                                                    type: GridElementType.Card,
                                                                                    colSpan: 4,
                                                                                    card: {
                                                                                        create: {
                                                                                            title: 'Your Lease tenants',
                                                                                            invertTitleDescription:
                                                                                                false,
                                                                                            description: `List`,
                                                                                            table: {
                                                                                                create: {
                                                                                                    type: 'LeaseTenant',
                                                                                                    typeTableRequest:
                                                                                                        'FindMany',
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
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
                                            name: 'Your essential data',
                                            columns: 4,
                                            icon: 'Gauge',
                                            elements: {
                                                create: [
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
