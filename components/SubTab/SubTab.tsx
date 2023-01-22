import { useFindUniqueSubTabFolder } from '@/zmodel/lib/hooks';
import { useRouter } from 'next/router';
import { GridScalarSchema } from '@zenstackhq/runtime/zod/models';
import { AutoTable } from '../AutoTable/AutoTable';

export const SubTab = () => {
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
    if (!subTab) {
        return <></>;
    }

    return (
        <AutoTable
            type={'Grid'}
            data={subTab.grids}
            additionalColumns={[]}
            onlyAdditionalColumns={false}
            formSchema={GridScalarSchema}
        />
    );
};
