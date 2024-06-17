import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { PanelComponentCounter } from '@zenstackhq/runtime/models';

export const Counter = ({ counter }: { counter: PanelComponentCounter }) => {
    const { useHook } = getTypeHook({ type: counter.tableType });

    // @ts-expect-error useAggregate is called with 0 arguments valid in all cases
    const { data } = useHook['aggregate']({
        _count: true,
    });

    return <>{data?._count}</>;
};
