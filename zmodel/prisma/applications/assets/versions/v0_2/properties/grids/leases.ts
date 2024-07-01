import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import {
    PropertyColumns,
    LeaseColumns,
    PropertyTenancyInCommonScalarSchemaColumns,
} from '@/zmodel/prisma/applications/assets/columns';

const grid: Omit<Prisma.GridCreateWithoutSubTabInput, 'index'> = {
    name: 'Leases',
    icon: 'FolderKey',
    elements: {
        create: [
            {
                index: 0,
                type: GridElementType.Card,
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 12,
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
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'lease',
                                                            columns: [],
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
                                    name: 'Tenants',
                                    elements: {
                                        create: {
                                            index: 0,
                                            type: GridElementType.Card,
                                            colSpan: 4,
                                            card: {
                                                create: {
                                                    title: 'Your Lease tenants',
                                                    invertTitleDescription: false,
                                                    description: `List`,
                                                    table: {
                                                        create: {
                                                            type: 'leaseTenant',
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
