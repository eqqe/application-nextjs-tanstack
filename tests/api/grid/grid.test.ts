import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '../../mock/enhanced-prisma';
import { GridInclude } from '@/components/Grid';

it('Should get grids', async () => {
    function checkGrids(grids: any) {
        assert.equal(grids.length, 1);
        assert.equal(grids[0].columns, 6);
        const card = grids[0].elements[0];
        assert.equal(card.type, 'Card');
        assert.equal(card.card?.footer?.button?.text, 'Create New Order');
        assert.equal(grids[0].elements[1].card?.footer?.progress?.value, 25);
        const tabs = grids[0].elements[3];
        assert.equal(tabs.type, 'Tabs');
        const cardInGrid = tabs.tabs?.tabsContent[0].elements[0];
        assert.equal(cardInGrid?.type, 'Card');
        assert.equal(cardInGrid?.card?.title, 'Your properties');
        assert.equal(cardInGrid?.card?.content, 'Listed here');
        assert.equal(cardInGrid?.card?.table?.type, 'Property');
        assert.deepEqual(cardInGrid?.card?.table?.columns, ['address', 'city', 'postalCode']);
    }
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const user1grids = await user1.prisma.grid.findMany({ include: GridInclude });
    assert.notOk(user1grids.length);

    const user2grids = await user2.prisma.grid.findMany({ include: GridInclude });
    checkGrids(user2grids);

    const user3grids = await user3.prisma.grid.findMany({ include: GridInclude });
    checkGrids(user3grids);
});
