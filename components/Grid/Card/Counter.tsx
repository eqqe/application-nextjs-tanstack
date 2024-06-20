import { Type } from '@zenstackhq/runtime/models';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';

export function Counter({ type }: { type: Type }) {
    const typeHook = getTypeHook({ type });
    // @ts-expect-error
    const { data: count } = typeHook.useCount();
    return <>{count}</>;
}
