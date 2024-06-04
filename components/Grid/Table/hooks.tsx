import {
    useAggregateDashboard,
    useAggregateList,
    useAggregateProperty,
    useAggregateTodo,
    useFindManyDashboard,
    useFindManyList,
    useFindManyProperty,
    useFindManyTodo,
} from '@/zmodel/lib/hooks';
import { Type } from '@prisma/client';

export function getTypeHook({ type }: { type: Type }) {
    switch (type) {
        case 'Property':
            return {
                useFindMany: useFindManyProperty,
                useAggregate: useAggregateProperty,
            };
        case 'Dashboard':
            return {
                useFindMany: useFindManyDashboard,
                useAggregate: useAggregateDashboard,
            };
        case 'List':
            return {
                useFindMany: useFindManyList,
                useAggregate: useAggregateList,
            };
        case 'Todo':
            return {
                useFindMany: useFindManyTodo,
                useAggregate: useAggregateTodo,
            };
    }
}
