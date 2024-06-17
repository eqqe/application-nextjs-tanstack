import { useAggregateProperty } from '@/zmodel/lib/hooks';
import { PanelComponentReport } from '@zenstackhq/runtime/models';

export const Report = ({ report }: { report: PanelComponentReport }) => {
    const { data } = useAggregateProperty({
        _count: true,
    });

    return <>{data?._count}</>;
};
