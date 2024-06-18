import { getGridUrl, getPropertyUrl, getSubTabFolderUrl } from '@/lib/urls';
import {
    useAggregateProperty,
    useFindManyProperty,
    useGroupByProperty,
    useUpdateProperty,
    useUpdateManyProperty,
    useCreateProperty,
    useCreateManyProperty,
    useAggregateLease,
    useGroupByLease,
    useFindManyLease,
    useUpdateLease,
    useUpdateManyLease,
    useCreateLease,
    useCreateManyLease,
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
    useGroupByGrid,
    useAggregateGrid,
    useFindManyGrid,
    useUpdateGrid,
    useUpdateManyGrid,
    useCreateGrid,
    useCreateManyGrid,
    useCountProperty,
    useCountCharge,
    useCountPayment,
    useCountLease,
    useCountGrid,
    useAggregateLeaseTenant,
    useCountLeaseTenant,
    useCreateLeaseTenant,
    useCreateManyLeaseTenant,
    useFindManyLeaseTenant,
    useGroupByLeaseTenant,
    useUpdateLeaseTenant,
    useUpdateManyLeaseTenant,
    useAggregatePerson,
    useCountPerson,
    useCreateManyPerson,
    useCreatePerson,
    useFindManyPerson,
    useGroupByPerson,
    useUpdateManyPerson,
    useUpdatePerson,
    useAggregateProfile,
    useCountProfile,
    useCreateManyProfile,
    useCreateProfile,
    useFindManyProfile,
    useGroupByProfile,
    useUpdateManyProfile,
    useUpdateProfile,
    useAggregatePropertyJointTenancy,
    useCountPropertyJointTenancy,
    useCreateManyPropertyJointTenancy,
    useCreatePropertyJointTenancy,
    useFindManyPropertyJointTenancy,
    useGroupByPropertyJointTenancy,
    useUpdateManyPropertyJointTenancy,
    useUpdatePropertyJointTenancy,
    useAggregatePropertyTenancyByEntirety,
    useCountPropertyTenancyByEntirety,
    useCreateManyPropertyTenancyByEntirety,
    useCreatePropertyTenancyByEntirety,
    useFindManyPropertyTenancyByEntirety,
    useGroupByPropertyTenancyByEntirety,
    useUpdateManyPropertyTenancyByEntirety,
    useUpdatePropertyTenancyByEntirety,
    useAggregatePropertyTenancyInCommon,
    useCountPropertyTenancyInCommon,
    useCreateManyPropertyTenancyInCommon,
    useCreatePropertyTenancyInCommon,
    useFindManyPropertyTenancyInCommon,
    useGroupByPropertyTenancyInCommon,
    useUpdateManyPropertyTenancyInCommon,
    useUpdatePropertyTenancyInCommon,
    useAggregatePropertyTenancyInCommonTenant,
    useCountPropertyTenancyInCommonTenant,
    useCreateManyPropertyTenancyInCommonTenant,
    useCreatePropertyTenancyInCommonTenant,
    useFindManyPropertyTenancyInCommonTenant,
    useGroupByPropertyTenancyInCommonTenant,
    useUpdateManyPropertyTenancyInCommonTenant,
    useUpdatePropertyTenancyInCommonTenant,
    useAggregateUser,
    useCountUser,
    useCreateManyUser,
    useCreateUser,
    useFindManyUser,
    useGroupByUser,
    useUpdateManyUser,
    useUpdateUser,
    useAggregateSubTabFolder,
    useCountSubTabFolder,
    useCreateManySubTabFolder,
    useCreateSubTabFolder,
    useFindManySubTabFolder,
    useGroupBySubTabFolder,
    useUpdateManySubTabFolder,
    useUpdateSubTabFolder,
} from '@/zmodel/lib/hooks';
import { Type } from '@prisma/client';
import {
    PropertyUpdateScalarSchema,
    PropertyCreateScalarSchema,
    PropertyScalarSchema,
    LeaseScalarSchema,
    LeaseUpdateScalarSchema,
    LeaseCreateScalarSchema,
    ChargeScalarSchema,
    ChargeUpdateScalarSchema,
    ChargeCreateScalarSchema,
    PaymentScalarSchema,
    PaymentUpdateScalarSchema,
    PaymentCreateScalarSchema,
    GridScalarSchema,
    GridUpdateScalarSchema,
    GridCreateScalarSchema,
    LeaseTenantCreateScalarSchema,
    LeaseTenantScalarSchema,
    LeaseTenantUpdateScalarSchema,
    PersonCreateScalarSchema,
    PersonScalarSchema,
    PersonUpdateScalarSchema,
    ProfileCreateScalarSchema,
    ProfileScalarSchema,
    ProfileUpdateScalarSchema,
    PropertyJointTenancyCreateScalarSchema,
    PropertyJointTenancyScalarSchema,
    PropertyJointTenancyUpdateScalarSchema,
    PropertyTenancyByEntiretyCreateScalarSchema,
    PropertyTenancyByEntiretyScalarSchema,
    PropertyTenancyByEntiretyUpdateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
    PropertyTenancyInCommonScalarSchema,
    PropertyTenancyInCommonUpdateScalarSchema,
    PropertyTenancyInCommonTenantCreateScalarSchema,
    PropertyTenancyInCommonTenantScalarSchema,
    PropertyTenancyInCommonTenantUpdateScalarSchema,
    UserCreateScalarSchema,
    UserScalarSchema,
    UserUpdateScalarSchema,
    SubTabFolderCreateScalarSchema,
    SubTabFolderScalarSchema,
    SubTabFolderUpdateScalarSchema,
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
                useCount: useCountProperty,
                useUpdate: {
                    single: useUpdateProperty,
                    many: useUpdateManyProperty,
                },
                useCreate: {
                    single: useCreateProperty,
                    many: useCreateManyProperty,
                },
                getLink: getPropertyUrl,
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
                useCount: useCountCharge,
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
                useCount: useCountPayment,
                useUpdate: {
                    single: useUpdatePayment,
                    many: useUpdateManyPayment,
                },
                useCreate: {
                    single: useCreatePayment,
                    many: useCreateManyPayment,
                },
            };
        case 'LeaseTenant':
            return {
                useHook: {
                    Aggregate: useAggregateLeaseTenant,
                    GroupBy: useGroupByLeaseTenant,
                    FindMany: useFindManyLeaseTenant,
                },
                schema: {
                    base: LeaseTenantScalarSchema,
                    update: LeaseTenantUpdateScalarSchema,
                    create: LeaseTenantCreateScalarSchema,
                },
                useCount: useCountLeaseTenant,
                useUpdate: {
                    single: useUpdateLeaseTenant,
                    many: useUpdateManyLeaseTenant,
                },
                useCreate: {
                    single: useCreateLeaseTenant,
                    many: useCreateManyLeaseTenant,
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
                useCount: useCountLease,
                useUpdate: {
                    single: useUpdateLease,
                    many: useUpdateManyLease,
                },
                useCreate: {
                    single: useCreateLease,
                    many: useCreateManyLease,
                },
            };
        case 'Person':
            return {
                useHook: {
                    Aggregate: useAggregatePerson,
                    GroupBy: useGroupByPerson,
                    FindMany: useFindManyPerson,
                },
                schema: {
                    base: PersonScalarSchema,
                    update: PersonUpdateScalarSchema,
                    create: PersonCreateScalarSchema,
                },
                useCount: useCountPerson,
                useUpdate: {
                    single: useUpdatePerson,
                    many: useUpdateManyPerson,
                },
                useCreate: {
                    single: useCreatePerson,
                    many: useCreateManyPerson,
                },
            };
        case 'Profile':
            return {
                useHook: {
                    Aggregate: useAggregateProfile,
                    GroupBy: useGroupByProfile,
                    FindMany: useFindManyProfile,
                },
                schema: {
                    base: ProfileScalarSchema,
                    update: ProfileUpdateScalarSchema,
                    create: ProfileCreateScalarSchema,
                },
                useCount: useCountProfile,
                useUpdate: {
                    single: useUpdateProfile,
                    many: useUpdateManyProfile,
                },
                useCreate: {
                    single: useCreateProfile,
                    many: useCreateManyProfile,
                },
            };
        case 'PropertyJointTenancy':
            return {
                useHook: {
                    Aggregate: useAggregatePropertyJointTenancy,
                    GroupBy: useGroupByPropertyJointTenancy,
                    FindMany: useFindManyPropertyJointTenancy,
                },
                schema: {
                    base: PropertyJointTenancyScalarSchema,
                    update: PropertyJointTenancyUpdateScalarSchema,
                    create: PropertyJointTenancyCreateScalarSchema,
                },
                useCount: useCountPropertyJointTenancy,
                useUpdate: {
                    single: useUpdatePropertyJointTenancy,
                    many: useUpdateManyPropertyJointTenancy,
                },
                useCreate: {
                    single: useCreatePropertyJointTenancy,
                    many: useCreateManyPropertyJointTenancy,
                },
            };
        case 'PropertyTenancyByEntirety':
            return {
                useHook: {
                    Aggregate: useAggregatePropertyTenancyByEntirety,
                    GroupBy: useGroupByPropertyTenancyByEntirety,
                    FindMany: useFindManyPropertyTenancyByEntirety,
                },
                schema: {
                    base: PropertyTenancyByEntiretyScalarSchema,
                    update: PropertyTenancyByEntiretyUpdateScalarSchema,
                    create: PropertyTenancyByEntiretyCreateScalarSchema,
                },
                useCount: useCountPropertyTenancyByEntirety,
                useUpdate: {
                    single: useUpdatePropertyTenancyByEntirety,
                    many: useUpdateManyPropertyTenancyByEntirety,
                },
                useCreate: {
                    single: useCreatePropertyTenancyByEntirety,
                    many: useCreateManyPropertyTenancyByEntirety,
                },
            };
        case 'PropertyTenancyInCommon':
            return {
                useHook: {
                    Aggregate: useAggregatePropertyTenancyInCommon,
                    GroupBy: useGroupByPropertyTenancyInCommon,
                    FindMany: useFindManyPropertyTenancyInCommon,
                },
                schema: {
                    base: PropertyTenancyInCommonScalarSchema,
                    update: PropertyTenancyInCommonUpdateScalarSchema,
                    create: PropertyTenancyInCommonCreateScalarSchema,
                },
                useCount: useCountPropertyTenancyInCommon,
                useUpdate: {
                    single: useUpdatePropertyTenancyInCommon,
                    many: useUpdateManyPropertyTenancyInCommon,
                },
                useCreate: {
                    single: useCreatePropertyTenancyInCommon,
                    many: useCreateManyPropertyTenancyInCommon,
                },
            };
        case 'PropertyTenancyInCommonTenant':
            return {
                useHook: {
                    Aggregate: useAggregatePropertyTenancyInCommonTenant,
                    GroupBy: useGroupByPropertyTenancyInCommonTenant,
                    FindMany: useFindManyPropertyTenancyInCommonTenant,
                },
                schema: {
                    base: PropertyTenancyInCommonTenantScalarSchema,
                    update: PropertyTenancyInCommonTenantUpdateScalarSchema,
                    create: PropertyTenancyInCommonTenantCreateScalarSchema,
                },
                useCount: useCountPropertyTenancyInCommonTenant,
                useUpdate: {
                    single: useUpdatePropertyTenancyInCommonTenant,
                    many: useUpdateManyPropertyTenancyInCommonTenant,
                },
                useCreate: {
                    single: useCreatePropertyTenancyInCommonTenant,
                    many: useCreateManyPropertyTenancyInCommonTenant,
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
                useCount: useCountGrid,
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
        case 'SubTabFolder':
            return {
                useHook: {
                    Aggregate: useAggregateSubTabFolder,
                    GroupBy: useGroupBySubTabFolder,
                    FindMany: useFindManySubTabFolder,
                },
                schema: {
                    base: SubTabFolderScalarSchema,
                    update: SubTabFolderUpdateScalarSchema,
                    create: SubTabFolderCreateScalarSchema,
                },
                useCount: useCountSubTabFolder,
                useUpdate: {
                    single: useUpdateSubTabFolder,
                    many: useUpdateManySubTabFolder,
                },
                useCreate: {
                    single: useCreateSubTabFolder,
                    many: useCreateManySubTabFolder,
                },
                getLink: getSubTabFolderUrl,
            };
        case 'User':
            return {
                useHook: {
                    Aggregate: useAggregateUser,
                    GroupBy: useGroupByUser,
                    FindMany: useFindManyUser,
                },
                schema: {
                    base: UserScalarSchema,
                    update: UserUpdateScalarSchema,
                    create: UserCreateScalarSchema,
                },
                useCount: useCountUser,
                useUpdate: {
                    single: useUpdateUser,
                    many: useUpdateManyUser,
                },
                useCreate: {
                    single: useCreateUser,
                    many: useCreateManyUser,
                },
            };
    }
}
