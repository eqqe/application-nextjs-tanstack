import { getGridUrl } from '@/lib/urls';
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
    useAggregateAssociate,
    useGroupByAssociate,
    useFindManyAssociate,
    useUpdateAssociate,
    useUpdateManyAssociate,
    useCreateAssociate,
    useCreateManyAssociate,
    useAggregateCharge,
    useGroupByCharge,
    useFindManyCharge,
    useUpdateCharge,
    useUpdateManyCharge,
    useCreateCharge,
    useCreateManyCharge,
    useAggregatePayment,
    useGroupByPayment,
    useFindManyPayment,
    useUpdatePayment,
    useUpdateManyPayment,
    useCreatePayment,
    useCreateManyPayment,
    useAggregateTenant,
    useGroupByTenant,
    useFindManyTenant,
    useUpdateTenant,
    useUpdateManyTenant,
    useCreateTenant,
    useCreateManyTenant,
    useGroupByGrid,
    useAggregateGrid,
    useFindManyGrid,
    useUpdateGrid,
    useUpdateManyGrid,
    useCreateGrid,
    useCreateManyGrid,
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
    AssociateScalarSchema,
    AssociateUpdateScalarSchema,
    AssociateCreateScalarSchema,
    ChargeScalarSchema,
    ChargeUpdateScalarSchema,
    ChargeCreateScalarSchema,
    PaymentScalarSchema,
    PaymentUpdateScalarSchema,
    PaymentCreateScalarSchema,
    TenantScalarSchema,
    TenantUpdateScalarSchema,
    TenantCreateScalarSchema,
    GridScalarSchema,
    GridUpdateScalarSchema,
    GridCreateScalarSchema,
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
        case 'Associate':
            return {
                useHook: {
                    Aggregate: useAggregateAssociate,
                    GroupBy: useGroupByAssociate,
                    FindMany: useFindManyAssociate,
                },
                schema: {
                    base: AssociateScalarSchema,
                    update: AssociateUpdateScalarSchema,
                    create: AssociateCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateAssociate,
                    many: useUpdateManyAssociate,
                },
                useCreate: {
                    single: useCreateAssociate,
                    many: useCreateManyAssociate,
                },
            };
        case 'Charge':
            return {
                useHook: {
                    Aggregate: useAggregateCharge,
                    GroupBy: useGroupByCharge,
                    FindMany: useFindManyCharge,
                },
                schema: {
                    base: ChargeScalarSchema,
                    update: ChargeUpdateScalarSchema,
                    create: ChargeCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateCharge,
                    many: useUpdateManyCharge,
                },
                useCreate: {
                    single: useCreateCharge,
                    many: useCreateManyCharge,
                },
            };
        case 'Payment':
            return {
                useHook: {
                    Aggregate: useAggregatePayment,
                    GroupBy: useGroupByPayment,
                    FindMany: useFindManyPayment,
                },
                schema: {
                    base: PaymentScalarSchema,
                    update: PaymentUpdateScalarSchema,
                    create: PaymentCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdatePayment,
                    many: useUpdateManyPayment,
                },
                useCreate: {
                    single: useCreatePayment,
                    many: useCreateManyPayment,
                },
            };
        case 'Tenant':
            return {
                useHook: {
                    Aggregate: useAggregateTenant,
                    GroupBy: useGroupByTenant,
                    FindMany: useFindManyTenant,
                },
                schema: {
                    base: TenantScalarSchema,
                    update: TenantUpdateScalarSchema,
                    create: TenantCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateTenant,
                    many: useUpdateManyTenant,
                },
                useCreate: {
                    single: useCreateTenant,
                    many: useCreateManyTenant,
                },
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
        case 'Grid':
            return {
                useHook: {
                    Aggregate: useAggregateGrid,
                    GroupBy: useGroupByGrid,
                    FindMany: useFindManyGrid,
                },
                schema: {
                    base: GridScalarSchema,
                    update: GridUpdateScalarSchema,
                    create: GridCreateScalarSchema,
                },
                useUpdate: {
                    single: useUpdateGrid,
                    many: useUpdateManyGrid,
                },
                useCreate: {
                    single: useCreateGrid,
                    many: useCreateManyGrid,
                },
                getLink: getGridUrl,
            };
    }
}
