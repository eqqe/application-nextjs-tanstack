import { useFindManyGrid } from '@/zmodel/lib/hooks';
import { getGridUrl } from '@/lib/urls';

export const findManyGridParams = {
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
};
export function useNavItems() {
    const { data: grids } = useFindManyGrid(findManyGridParams);
    return grids?.map((grid) => ({
        title: `Application ${grid.subTab.tab.folder.applicationVersion.applicationSlug}`,
        href: getGridUrl(grid.id),
    }));
}
