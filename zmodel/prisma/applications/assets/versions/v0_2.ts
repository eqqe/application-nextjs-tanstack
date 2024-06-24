import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import { PropertyColumns, LeaseColumns, PropertyTenancyInCommonScalarSchemaColumns } from '../columns';

export const assetsv0_2: Prisma.ApplicationVersionCreateWithoutApplicationInput = {
    versionMajor: 0,
    versionMinor: 2,
    folders: {
        create: [
            {
                path: '/properties',
                index: 0,
                tabs: {
                    create: {
                        index: 0,
                        subTabs: {
                            create: {
                                index: 0,
                                name: 'Properties',
                                grids: {
                                    create: [
                                        {
                                            index: 0,
                                            name: 'Properties',
                                            columns: 6,
                                            icon: 'Home',
                                            elements: {
                                                create: [
                                                    {
                                                        index: 0,
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
                                                        index: 1,
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
                                                        index: 2,
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
                                                        index: 3,
                                                        type: GridElementType.Tabs,
                                                        colSpan: 4,
                                                        tabs: {
                                                            create: {
                                                                tabsContent: {
                                                                    create: [
                                                                        {
                                                                            index: 0,
                                                                            name: 'All',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 1,
                                                                            name: 'Surface / city',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 2,
                                                                            name: 'Type',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                            index: 1,
                                            name: 'Property Tenancies',
                                            columns: 8,
                                            icon: 'SquareUser',
                                            elements: {
                                                create: [
                                                    {
                                                        index: 0,
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Property Tenancy',
                                                                invertTitleDescription: false,
                                                                description: `Count`,
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 1,
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your joint property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyJointTenancy',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Property Tenancy Joint',
                                                                                table: 'PropertyJointTenancy',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 2,
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your in common property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyTenancyInCommon',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create PropertyTenancyInCommon',
                                                                                table: 'PropertyTenancyInCommon',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 3,
                                                        type: GridElementType.Card,
                                                        colSpan: 1,
                                                        card: {
                                                            create: {
                                                                title: 'Your by entirety property tenancies',
                                                                invertTitleDescription: false,
                                                                description: `property tenancy`,
                                                                count: 'PropertyTenancyByEntirety',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create PropertyTenancyByEntirety',
                                                                                table: 'PropertyTenancyByEntirety',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 4,
                                                        type: GridElementType.Tabs,
                                                        colSpan: 8,
                                                        tabs: {
                                                            create: {
                                                                tabsContent: {
                                                                    create: [
                                                                        {
                                                                            index: 0,
                                                                            name: 'Common',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 1,
                                                                            name: 'Joint',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 2,
                                                                            name: 'By entirety',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 3,
                                                                            name: 'Tenants In Common',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 4,
                                                                            name: 'All',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                            index: 2,
                                            name: 'Leases',
                                            columns: 4,
                                            icon: 'FolderKey',
                                            elements: {
                                                create: [
                                                    {
                                                        index: 0,
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
                                                        index: 1,
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
                                                        index: 2,
                                                        type: GridElementType.Tabs,
                                                        colSpan: 4,
                                                        tabs: {
                                                            create: {
                                                                tabsContent: {
                                                                    create: [
                                                                        {
                                                                            index: 0,
                                                                            name: 'Leases',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                                                            index: 1,
                                                                            name: 'Tenants',
                                                                            elements: {
                                                                                create: {
                                                                                    index: 0,
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
                                            index: 3,
                                            name: 'Your essential data',
                                            columns: 4,
                                            icon: 'Gauge',
                                            elements: {
                                                create: [
                                                    {
                                                        index: 0,
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
                                                        index: 1,
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your PropertyTenancyInCommon',
                                                                invertTitleDescription: false,
                                                                description: `PropertyTenancyInCommon`,
                                                                count: 'PropertyTenancyInCommon',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create PropertyTenancyInCommon',
                                                                                table: 'PropertyTenancyInCommon',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 2,
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
                                                        index: 3,
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your persons',
                                                                invertTitleDescription: false,
                                                                description: `persons`,
                                                                count: 'Person',
                                                                icon: 'Users',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create person',
                                                                                table: 'Person',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },

                                                    {
                                                        index: 4,
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your PropertyTenancyByEntirety',
                                                                invertTitleDescription: false,
                                                                description: `PropertyTenancyByEntirety`,
                                                                count: 'PropertyTenancyByEntirety',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create PropertyTenancyByEntirety',
                                                                                table: 'PropertyTenancyByEntirety',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },

                                                    {
                                                        index: 5,
                                                        type: GridElementType.Card,
                                                        colSpan: 2,
                                                        card: {
                                                            create: {
                                                                title: 'Your PropertyJointTenancy',
                                                                invertTitleDescription: false,
                                                                description: `PropertyJointTenancy`,
                                                                count: 'PropertyJointTenancy',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create PropertyJointTenancy',
                                                                                table: 'PropertyJointTenancy',
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        index: 6,
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
                                                        index: 7,
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
