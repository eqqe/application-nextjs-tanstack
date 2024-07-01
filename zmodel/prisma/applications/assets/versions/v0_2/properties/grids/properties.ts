import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import {
    PropertyColumns,
    LeaseColumns,
    PropertyTenancyInCommonScalarSchemaColumns,
} from '@/zmodel/prisma/applications/assets/columns';

const grid: Omit<Prisma.GridCreateWithoutSubTabInput, 'index'> = {
    name: 'Properties',
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
                colSpan: 12,
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
                                                            typeTableRequest: 'findMany',
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
                                                            typeTableRequest: TypeTableRequest.groupBy,
                                                            groupBy: {
                                                                create: {
                                                                    fields: [PropertyColumns.city],
                                                                    sum: [PropertyColumns.surface],
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
                                                            typeTableRequest: TypeTableRequest.groupBy,
                                                            chart: {
                                                                create: {
                                                                    type: 'PieChart',
                                                                },
                                                            },
                                                            groupBy: {
                                                                create: {
                                                                    fields: [PropertyColumns.propertyType],
                                                                    count: [PropertyColumns.propertyType],
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
};

export default grid;
