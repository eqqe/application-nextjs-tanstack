import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { useCurrentSpace } from '@/lib/context';
import { PanelComponentCounter } from '@zenstackhq/runtime/models';

export const Counter = ({ counter }: { counter: PanelComponentCounter }) => {
    const space = useCurrentSpace();
    if (!space) {
        throw '!spaceId';
    }
    const { useHook } = getTypeHook({ type: counter.tableType });

    // @ts-expect-error useAggregate is called with 0 arguments valid in all cases
    const { data } = useHook['aggregate']({
        _count: true,
    });

    return <>{data?._count}</>;
};
