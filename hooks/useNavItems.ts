import { useFindManySubTabFolder } from '@/zmodel/lib/hooks';
import { getGridUrl } from '@/lib/urls';

export function useNavItems() {
    const { data: subTabs } = useFindManySubTabFolder({
        include: {
            grids: true,
        },
    });
    return subTabs?.flatMap((subTab) =>
        subTab.grids.map((grid) => ({
            title: `${grid.name}`,
            href: getGridUrl(grid.id),
        }))
    );
}
