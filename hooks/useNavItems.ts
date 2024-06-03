import { useFindManyGrid } from '@/zmodel/lib/hooks';
import { getGridUrl } from '@/lib/urls';
export interface NavItem {
    title: string;
    href: string;
}

export function useNavItems(): NavItem[] {
    const { data: grids } = useFindManyGrid();

    if (!grids) {
        return [];
    }
    return grids.map((grid) => ({
        title: grid.slug,
        href: getGridUrl(grid.id),
    }));
}
