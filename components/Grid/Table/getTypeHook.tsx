import {
    useAggregateDashboard,
    useAggregateList,
    useAggregateProperty,
    useAggregateTodo,
    useFindManyDashboard,
    useFindManyList,
    useFindManyProperty,
    useFindManyTodo,
    useGroupByProperty,
    useGroupByDashboard,
    useGroupByList,
    useGroupByTodo,
} from '@/zmodel/lib/hooks';
import { Type, TypeTableRequest } from '@prisma/client';

export function getTypeHook({ type, typeTableRequest }: { type: Type; typeTableRequest: TypeTableRequest }) {
    const res = {
        useFindMany: void 0,
        useAggregate: void 0,
        useGroupBy: void 0,
    };
    switch (typeTableRequest) {
        case 'Aggregate':
            switch (type) {
                case 'Property':
                    return useAggregateProperty;
                case 'Dashboard':
                    return useAggregateDashboard;
                case 'List':
                    return useAggregateList;
                case 'Todo':
                    return useAggregateTodo;
            }
        case 'GroupBy':
            switch (type) {
                case 'Property':
                    return useGroupByProperty;
                case 'Dashboard':
                    return useGroupByDashboard;
                case 'List':
                    return useGroupByList;
                case 'Todo':
                    return useGroupByTodo;
            }
        case 'FindMany':
            switch (type) {
                case 'Property':
                    return useFindManyProperty;
                case 'Dashboard':
                    return useFindManyDashboard;
                case 'List':
                    return useFindManyList;
                case 'Todo':
                    return useFindManyTodo;
            }
    }
}
