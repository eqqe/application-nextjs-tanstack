import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest, ChartType } from '@prisma/client';
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
                                        table: Type.property,
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
                colSpan: 12,
                tabs: {
                    create: {
                        tabsContent: {
                            create: [
                                {
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
                                                            typeTableRequest: TypeTableRequest.findMany,
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
                                                                    type: ChartType.PieChart,
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
                            ].map((tabContent, index) => ({ ...tabContent, index })),
                        },
                    },
                },
            },
        ].map((element, index) => ({ ...element, index })),
    },
};

export default grid;
