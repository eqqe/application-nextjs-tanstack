import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { useFindUniqueGridParam } from '@/components/useFindGridDetails';

it('Should enable an application in space', async () => {
    const {
        user1: { prisma, space, enableAssets },
    } = await getEnhancedPrisma();
    await prisma.list.create({
        data: {
            name: 'test',
            space: {
                connect: {
                    id: space.id,
                },
            },
        },
    });

    await enableAssets();

    const appDetails = await prisma.space.findMany({
        include: {
            applications: {
                include: {
                    folders: true,
                },
            },
        },
    });
    assert.equal(appDetails.length, 1);

    const firstFolder = appDetails[0].applications[0].folders[0];
    assert.equal(firstFolder.path, '/properties');

    const grids = await prisma.grid.findMany();
    assert.equal(grids.length, 2);
    const firstGrid = grids[0];
    assert.equal(firstGrid.columns, 6);

    const gridDetail = await prisma.grid.findUnique(useFindUniqueGridParam(firstGrid.id));
    assert(gridDetail);
    assert.equal(gridDetail.columns, 6);
    assert.equal(gridDetail.elements.length, 4);

    const cardElement = gridDetail.elements[0];
    assert.equal(cardElement.type, 'Card');
    assert.equal(cardElement.card?.footer?.button?.text, 'Create Property');

    const tabsElement = gridDetail.elements[3];
    assert.equal(tabsElement.type, 'Tabs');
    const cardTableGroupBy = tabsElement.tabs?.tabsContent[0].elements[0].card?.table;
    assert.deepEqual(cardTableGroupBy?.columns, []);
    assert.equal(cardTableGroupBy?.typeTableRequest, 'GroupBy');
    assert.deepEqual(cardTableGroupBy?.groupBy?.sum, ['surface']);
    assert.deepEqual(cardTableGroupBy?.groupBy?.fields, ['city']);

    const cardTableList = tabsElement.tabs?.tabsContent[1].elements[0].card?.table;

    assert.deepEqual(cardTableList?.columns, ['streetAddress', 'city', 'postalCode']);
    assert.equal(cardTableList?.typeTableRequest, 'FindMany');
    assert.notOk(cardTableList?.groupBy);
});
