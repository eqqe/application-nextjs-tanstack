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
                                                                                table: 'property',
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
                                                                                                    type: Type.property,
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
                                                                                                    type: Type.property,
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
                                                                                                    type: Type.property,
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
                                                                count: 'propertyJointTenancy',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Property Tenancy Joint',
                                                                                table: 'propertyJointTenancy',
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
                                                                count: 'propertyTenancyInCommon',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create propertyTenancyInCommon',
                                                                                table: 'propertyTenancyInCommon',
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
                                                                count: 'propertyTenancyByEntirety',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create propertyTenancyByEntirety',
                                                                                table: 'propertyTenancyByEntirety',
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
                                                                                                    type: 'propertyTenancyInCommon',
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
                                                                                                    type: 'propertyJointTenancy',
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
                                                                                                    type: 'propertyTenancyByEntirety',
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
                                                                                                    type: 'propertyTenancyInCommonTenant',
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
                                                                                                    type: 'propertyTenancy',
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
                                                                count: 'lease',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease',
                                                                                table: 'lease',
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
                                                                count: 'leaseTenant',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Lease Tenants',
                                                                                table: 'leaseTenant',
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
                                                                                                    type: 'lease',
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
                                                                                                    type: 'leaseTenant',
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
                                                                count: 'property',
                                                                icon: 'Home',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create Property',
                                                                                table: 'property',
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
                                                                title: 'Your propertyTenancyInCommon',
                                                                invertTitleDescription: false,
                                                                description: `propertyTenancyInCommon`,
                                                                count: 'propertyTenancyInCommon',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create propertyTenancyInCommon',
                                                                                table: 'propertyTenancyInCommon',
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
                                                                count: 'lease',
                                                                icon: 'FolderKey',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create lease',
                                                                                table: 'lease',
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
                                                                count: 'person',
                                                                icon: 'Users',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create person',
                                                                                table: 'person',
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
                                                                title: 'Your propertyTenancyByEntirety',
                                                                invertTitleDescription: false,
                                                                description: `propertyTenancyByEntirety`,
                                                                count: 'propertyTenancyByEntirety',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create propertyTenancyByEntirety',
                                                                                table: 'propertyTenancyByEntirety',
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
                                                                title: 'Your propertyJointTenancy',
                                                                invertTitleDescription: false,
                                                                description: `propertyJointTenancy`,
                                                                count: 'propertyJointTenancy',
                                                                icon: 'SquareUser',
                                                                footer: {
                                                                    create: {
                                                                        button: {
                                                                            create: {
                                                                                text: 'Create propertyJointTenancy',
                                                                                table: 'propertyJointTenancy',
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
                                                                        type: 'lease',
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
                                                                        type: 'property',
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
