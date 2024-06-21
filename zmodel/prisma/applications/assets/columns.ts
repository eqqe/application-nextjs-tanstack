import { LeaseScalarSchema, PropertyScalarSchema } from '@zenstackhq/runtime/zod/models';

export const PropertyColumns = PropertyScalarSchema.keyof().Values;
export const LeaseColumns = LeaseScalarSchema.keyof().Values;
