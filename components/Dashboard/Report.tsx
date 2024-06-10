import { useCurrentSpace } from '@/lib/context';
import { useAggregateProperty } from '@/zmodel/lib/hooks';
import { PanelComponentReport } from '@zenstackhq/runtime/models';

export const Report = ({ report }: { report: PanelComponentReport }) => {
    const space = useCurrentSpace();
    if (!space) {
        throw '!spaceId';
    }

    const { data } = useAggregateProperty({
        _count: true,
    });

    return <>{data?._count}</>;
};
