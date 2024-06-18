import { useFindUniqueSubTabFolder } from '@/zmodel/lib/hooks';
import { useRouter } from 'next/router';

export function useCurrentSubTab() {
    const router = useRouter();
    const subTabId = router.query.subTabId as string;

    const { data: subTab } = useFindUniqueSubTabFolder(
        {
            where: {
                id: subTabId,
            },
            include: {
                grids: true,
            },
        },
        {
            enabled: !!subTabId,
        }
    );
    return subTab;
}
