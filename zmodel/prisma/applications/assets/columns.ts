import {
    LeaseScalarSchema,
    PropertyScalarSchema,
    PropertyTenancyInCommonScalarSchema,
} from '@zenstackhq/runtime/zod/models';

export const PropertyColumns = PropertyScalarSchema.keyof().Values;
export const propertyTenancyInCommonScalarSchemaColumns = PropertyTenancyInCommonScalarSchema.keyof().Values;
export const LeaseColumns = LeaseScalarSchema.keyof().Values;
