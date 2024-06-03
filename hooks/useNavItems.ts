import { useFindManyGrid } from '@/zmodel/lib/hooks';
import { getGridUrl } from '@/lib/urls';
export interface NavItem {
    title: string;
    href: string;
}

export function useNavItems(): NavItem[] {
    const { data: grids } = useFindManyGrid({
        include: {
            subTab: {
                include: {
                    tab: {
                        include: {
                            folder: {
                                include: {
                                    applicationVersion: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!grids) {
        return [];
    }
    return grids.map((grid) => ({
        title: grid.subTab.tab.folder.applicationVersion.applicationSlug,
        href: getGridUrl(grid.id),
    }));
}
