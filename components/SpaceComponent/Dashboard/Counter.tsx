import { useCurrentSpace } from '@/lib/context';
import { useAggregateTable } from '@/zmodel/lib/hooks';
import { PanelComponentCounter } from '@zenstackhq/runtime/models';

export const Counter = ({ counter }: { counter: PanelComponentCounter }) => {
    const space = useCurrentSpace();
    if (!space) {
        throw '!spaceId';
    }
    const { data } = useAggregateTable({
        where: {
            type: counter.tableType,
        },
        _count: true,
    });

    return <>{data?._count}</>;
};
