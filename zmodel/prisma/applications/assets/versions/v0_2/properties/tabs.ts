import { type Prisma } from '@prisma/client';
import propertiesGrid from './grids/properties';
import propertyTenanciesGrid from './grids/propertyTenancies';
import leasesGrid from './grids/leases';
import essentialDataGrid from './grids/essentialData';

const tabs: Prisma.TabFolderCreateWithoutFolderInput[] = [
    {
        index: 0,
        subTabs: {
            create: {
                index: 0,
                name: 'Properties',
                grids: {
                    create: [propertiesGrid, propertyTenanciesGrid, leasesGrid, essentialDataGrid].map(
                        (grid, index) => ({ ...grid, index })
                    ),
                },
            },
        },
    },
];

export default tabs;
