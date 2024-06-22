import { useFindUniqueGrid } from '@/zmodel/lib/hooks';
import { GridCardInclude } from '@/components/Grid/Card/GridCard';
import { GridTabsInclude } from '@/components/Grid/Tabs/GridTabs';
import { useRouter } from 'next/router';
import { orderByCreatedAt } from '@/lib/utils';

export const GridInclude = {
    elements: {
        include: {
            card: GridCardInclude,
            tabs: GridTabsInclude,
        },
        ...orderByCreatedAt,
    },
    subTab: true,
};
export const useFindUniqueGridParam = (gridId: string) => ({
    where: {
        id: gridId,
    },
    include: GridInclude,
});
export const useCurrentGrid = () => {
    const router = useRouter();
    const gridId = router.query.gridId as string;

    const { data: grid } = useFindUniqueGrid(useFindUniqueGridParam(gridId), {
        enabled: !!gridId,
    });
    return grid;
};
