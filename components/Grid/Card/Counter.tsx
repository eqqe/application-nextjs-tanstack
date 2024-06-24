import { typeHooks } from '@/zmodel/lib/forms/typeHooks';
import { Type } from '@prisma/client';
export function Counter({ type }: { type: Type }) {
    const typeHook = typeHooks[type];
    // @ts-expect-error
    const { data: count } = typeHook.useCount();
    return <>{count}</>;
}
