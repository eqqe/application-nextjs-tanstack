import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import {
    PropertyColumns,
    LeaseColumns,
    PropertyTenancyInCommonScalarSchemaColumns,
} from '@/zmodel/prisma/applications/assets/columns';

const grid: Omit<Prisma.GridCreateWithoutSubTabInput, 'index'> = {
    name: 'Property Tenancies',
    icon: 'SquareUser',
    elements: {
        create: [
            {
                index: 0,
                type: GridElementType.Card,
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 12,
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
                                                    invertTitleDescription: false,
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
                                                            typeTableRequest: 'findMany',
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
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'propertyJointTenancy',
                                                            typeTableRequest: 'findMany',
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
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'propertyTenancyByEntirety',
                                                            typeTableRequest: 'findMany',
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
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'propertyTenancyInCommonTenant',
                                                            typeTableRequest: 'findMany',
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
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'propertyTenancy',
                                                            typeTableRequest: 'findMany',
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
};

export default grid;
