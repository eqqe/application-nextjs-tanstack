import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { GridInclude } from '@/hooks/useCurrentGrid';

it('Should get grids', async () => {
    function checkGrids() {
        assert.equal(grids.length, 3);
        const secondGrid = grids[1];
        assert.equal(secondGrid.columns, 6);
        const card = secondGrid.elements[0];
        assert.equal(card.type, 'Card');
        assert.equal(card.card?.footer?.button?.text, 'Create Property');
        assert.equal(secondGrid.elements[1].card?.footer?.progress?.value, 25);
        const tabs = secondGrid.elements[3];
        assert.equal(tabs.type, 'Tabs');
        const cardInGrid = tabs.tabs?.tabsContent[0].elements[0];
        assert.equal(cardInGrid?.type, 'Card');
        assert.equal(cardInGrid?.card?.title, 'Your properties');
        assert.equal(cardInGrid?.card?.content, 'Listed here');
        assert.equal(cardInGrid?.card?.table?.type, 'Property');
        assert.deepEqual(cardInGrid?.card?.table?.columns, []);
        assert.deepEqual(cardInGrid?.card?.table?.groupBy?.sum, ['surface']);
        assert.deepEqual(cardInGrid?.card?.table?.groupBy?.fields, ['city']);
    }
    const { user1, user2, user3 } = await getEnhancedPrisma();

    let grids = await user1.prisma.grid.findMany({ include: GridInclude });
    assert.notOk(grids.length);

    grids = await user2.prisma.grid.findMany({ include: GridInclude });
    checkGrids();

    grids = await user3.prisma.grid.findMany({ include: GridInclude });
    checkGrids();
});
