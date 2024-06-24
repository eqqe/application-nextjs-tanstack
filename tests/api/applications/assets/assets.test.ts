import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { useFindUniqueGridParam } from '@/hooks/useCurrentGrid';

it('Should enable an application in space', async () => {
    const {
        user1: { prisma, enableAssets },
    } = await getEnhancedPrisma();

    await enableAssets();

    const appDetails = await prisma.space.findMany({
        include: {
            applications: {
                include: {
                    applicationVersion: {
                        include: {
                            folders: true,
                        },
                    },
                },
            },
        },
    });
    assert.equal(appDetails.length, 1);

    const firstFolder = appDetails[0].applications[0].applicationVersion.folders[0];
    assert.equal(firstFolder.path, '/properties');

    const grids = await prisma.grid.findMany();
    assert.equal(grids.length, 4);
    const secondGrid = grids[0];
    assert.equal(secondGrid.columns, 6);

    const gridDetail = await prisma.grid.findUnique(useFindUniqueGridParam(secondGrid.id));
    assert(gridDetail);
    assert.equal(gridDetail.columns, 6);
    assert.equal(gridDetail.elements.length, 4);

    const cardElement = gridDetail.elements[0];
    assert.equal(cardElement.type, 'Card');
    assert.equal(cardElement.card?.footer?.button?.text, 'Create Property');

    const tabsElement = gridDetail.elements[3];
    assert.equal(tabsElement.type, 'Tabs');
    const cardTable = tabsElement.tabs?.tabsContent[0].elements[0].card?.table;
    assert.deepEqual(cardTable?.columns, ['streetAddress', 'city', 'postalCode']);
    assert.equal(cardTable?.typeTableRequest, 'findMany');
    assert.notOk(cardTable?.groupBy);

    const cardTableList = tabsElement.tabs?.tabsContent[1].elements[0].card?.table;

    assert.deepEqual(cardTableList?.columns, []);
    assert.equal(cardTableList?.typeTableRequest, 'groupBy');
    assert.deepEqual(cardTableList?.groupBy?.sum, ['surface']);
    assert.deepEqual(cardTableList?.groupBy?.fields, ['city']);
});
