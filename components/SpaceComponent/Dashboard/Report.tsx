import { useCurrentSpace } from '@/lib/context';
import { useAggregateTable } from '@/zmodel/lib/hooks';
import { PanelComponentReport } from '@zenstackhq/runtime/models';

export const Report = ({ report }: { report: PanelComponentReport }) => {
    const space = useCurrentSpace();
    if (!space) {
        throw '!spaceId';
    }

    const { data } = useAggregateTable({
        where: {
            type: report.tableType,
        },
        _count: true,
    });

    return <>{data?._count}</>;
};
