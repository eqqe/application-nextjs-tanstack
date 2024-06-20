import { getGridUrl } from '@/lib/urls';
import { useSubTabs } from '@/lib/context';

export function useNavItems() {
    const subTabs = useSubTabs();
    return subTabs?.flatMap((subTab) =>
        subTab.grids.map((grid) => ({
            title: `${grid.name}`,
            href: getGridUrl(grid.id),
        }))
    );
}
