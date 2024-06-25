import { Type } from '@prisma/client';
import { trpc } from '@/lib/trpc';
export function Counter({ type }: { type: Type }) {
    const useCountQuery = trpc[type].count.useQuery;
    // @ts-expect-error
    const { data: count } = useCountQuery({});
    return <>{count}</>;
}
