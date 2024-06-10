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
    useUpdateDashboard,
    useUpdateManyDashboard,
    useUpdateProperty,
    useUpdateManyProperty,
    useUpdateList,
    useUpdateManyList,
    useUpdateManyTodo,
    useUpdateTodo,
    useCreateProperty,
    useCreateManyProperty,
    useCreateDashboard,
    useCreateList,
    useCreateManyDashboard,
    useCreateManyList,
    useCreateManyTodo,
    useCreateTodo,
    useAggregateLease,
    useGroupByLease,
    useFindManyLease,
    useUpdateLease,
    useUpdateManyLease,
    useCreateLease,
    useCreateManyLease,
} from '@/zmodel/lib/hooks';
import { Type } from '@prisma/client';
import {
    PropertyUpdateScalarSchema,
    DashboardUpdateScalarSchema,
    ListUpdateScalarSchema,
    TodoUpdateScalarSchema,
    PropertyCreateScalarSchema,
    DashboardCreateScalarSchema,
    ListCreateScalarSchema,
    TodoCreateScalarSchema,
    PropertyScalarSchema,
    DashboardScalarSchema,
    ListScalarSchema,
    TodoScalarSchema,
    LeaseScalarSchema,
    LeaseUpdateScalarSchema,
    LeaseCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';

export function getTypeHook({ type }: { type: Type }) {
    switch (type) {
        case 'Property':
            return {
                useHook: {
                    Aggregate: useAggregateProperty,
                    GroupBy: useGroupByProperty,
                    FindMany: useFindManyProperty,
                },
                schema: {
                    base: PropertyScalarSchema,
                    update: PropertyUpdateScalarSchema,
                    create: PropertyCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateProperty,
                    many: useUpdateManyProperty,
                },
                useCreate: {
                    single: useCreateProperty,
                    many: useCreateManyProperty,
                },
                getLink: (id: string) => `/property/${id}`,
            };
        case 'Dashboard':
            return {
                useHook: {
                    Aggregate: useAggregateDashboard,
                    GroupBy: useGroupByDashboard,
                    FindMany: useFindManyDashboard,
                },
                schema: {
                    base: DashboardScalarSchema,
                    update: DashboardUpdateScalarSchema,
                    create: DashboardCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateDashboard,
                    many: useUpdateManyDashboard,
                },
                useCreate: {
                    single: useCreateDashboard,
                    many: useCreateManyDashboard,
                },
            };
        case 'List':
            return {
                useHook: {
                    Aggregate: useAggregateList,
                    GroupBy: useGroupByList,
                    FindMany: useFindManyList,
                },
                schema: {
                    base: ListScalarSchema,
                    update: ListUpdateScalarSchema,
                    create: ListCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateList,
                    many: useUpdateManyList,
                },
                useCreate: {
                    single: useCreateList,
                    many: useCreateManyList,
                },
            };
        case 'Todo':
            return {
                useHook: {
                    Aggregate: useAggregateTodo,
                    GroupBy: useGroupByTodo,
                    FindMany: useFindManyTodo,
                },
                schema: {
                    base: TodoScalarSchema,
                    update: TodoUpdateScalarSchema,
                    create: TodoCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateTodo,
                    many: useUpdateManyTodo,
                },
                useCreate: {
                    single: useCreateTodo,
                    many: useCreateManyTodo,
                },
            };
        case 'Lease':
            return {
                useHook: {
                    Aggregate: useAggregateLease,
                    GroupBy: useGroupByLease,
                    FindMany: useFindManyLease,
                },
                schema: {
                    base: LeaseScalarSchema,
                    update: LeaseUpdateScalarSchema,
                    create: LeaseCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateLease,
                    many: useUpdateManyLease,
                },
                useCreate: {
                    single: useCreateLease,
                    many: useCreateManyLease,
                },
            };
    }
}
