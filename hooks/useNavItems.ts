import { useFindManyGrid } from '@/zmodel/lib/hooks';
import { getGridUrl } from '@/lib/urls';

export function useNavItems() {
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
    return grids?.map((grid) => ({
        title: `Application ${grid.subTab.tab.folder.applicationVersion.applicationSlug}`,
        href: getGridUrl(grid.id),
    }));
}
