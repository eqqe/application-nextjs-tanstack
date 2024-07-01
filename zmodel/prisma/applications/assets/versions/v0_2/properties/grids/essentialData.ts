import { GridElementType } from '@prisma/client';
import { Type, type Prisma, TypeTableRequest } from '@prisma/client';
import { PropertyColumns, LeaseColumns } from '@/zmodel/prisma/applications/assets/columns';
import { AssetsLocaleKeys } from '@/zmodel/prisma/applications/assets/locales/fr';

const grid: Omit<Prisma.GridCreateWithoutSubTabInput, 'index'> & { name: AssetsLocaleKeys } = {
    name: 'yourEssentialData',
    icon: 'Gauge',
    elements: {
        create: [
            {
                index: 0,
                type: GridElementType.Card,
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 3,
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
                colSpan: 5,
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
                                typeTableRequest: 'groupBy',
                            },
                        },
                    },
                },
            },
            {
                index: 7,
                type: GridElementType.Card,
                colSpan: 5,
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
                                typeTableRequest: 'groupBy',
                            },
                        },
                    },
                },
            },
        ],
    },
};

export default grid;
