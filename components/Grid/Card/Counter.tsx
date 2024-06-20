import { Type } from '@zenstackhq/runtime/models';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';

export function Counter({ type }: { type: Type }) {
    const typeHook = getTypeHook({ type });
    // @ts-expect-error
    const { data: count } = typeHook.useCount();
    return <>{`${count} ${beautifyObjectName(type)}`}</>;
}
