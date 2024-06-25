import { GridCardInclude } from '@/components/Grid/Card/GridCard';
import { GridTabsInclude } from '@/components/Grid/Tabs/GridTabs';
import { useRouter } from 'next/router';
import { orderByIndex } from '@/lib/utils';
import { trpc } from '@/lib/trpc';

export const GridInclude = {
    elements: {
        include: {
            card: GridCardInclude,
            tabs: GridTabsInclude,
        },
        ...orderByIndex,
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

    const params = useFindUniqueGridParam(gridId);

    const { data: grid } = trpc.grid.findUnique.useQuery(params, { enabled: !!gridId });
    return grid;
};
