import { useFindManyGrid, useFindManySubTabFolder } from '@/zmodel/lib/hooks';
import { getGridUrl, getSubTabFolderUrl } from '@/lib/urls';

export function useNavItems() {
    const { data: subTabs } = useFindManySubTabFolder();
    return subTabs?.map((subTab) => ({
        title: `SubTab ${subTab.name}`,
        href: getSubTabFolderUrl(subTab.id),
    }));
}
