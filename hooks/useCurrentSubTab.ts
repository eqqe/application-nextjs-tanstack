import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/router';

export function useCurrentSubTab() {
    const router = useRouter();
    const subTabId = router.query.subTabId as string;

    const { data: subTab } = trpc.subTabFolder.findUnique.useQuery(
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
