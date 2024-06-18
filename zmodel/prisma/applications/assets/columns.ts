import { PropertyScalarSchema } from '@zenstackhq/runtime/zod/models';

export const PropertyColumns = PropertyScalarSchema.keyof().Values;
