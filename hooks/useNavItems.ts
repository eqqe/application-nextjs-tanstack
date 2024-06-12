import { useFindManyGrid, useFindManySubTabFolder } from '@/zmodel/lib/hooks';
import { getGridUrl, getSubTabUrl } from '@/lib/urls';

export function useNavItems() {
    const { data: subTabs } = useFindManySubTabFolder();
    return subTabs?.map((subTab) => ({
        title: `SubTab ${subTab.name}`,
        href: getSubTabUrl(subTab.id),
    }));
}
