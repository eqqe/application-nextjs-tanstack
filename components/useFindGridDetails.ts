import { useFindUniqueGrid } from '@/zmodel/lib/hooks';
import { GridInclude } from './Grid/Grid';

export const useFindUniqueGridParam = (gridId: string) => ({
    where: {
        id: gridId,
    },
    include: GridInclude,
});
export const useFindGridDetails = (gridId: string) => {
    const { data: grid } = useFindUniqueGrid(useFindUniqueGridParam(gridId), {
        enabled: !!gridId,
    });
    return grid;
};
