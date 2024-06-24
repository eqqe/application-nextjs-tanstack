import { Type } from '@prisma/client';
import { trpc } from '@/lib/trpc';
export function Counter({ type }: { type: Type }) {
    const { data: count } = trpc[type].count.useQuery();
    return <>{count}</>;
}
