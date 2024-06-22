import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { z } from 'zod';

export function getOrFilter({
    formSchema,
    query,
}: {
    formSchema: ReturnType<typeof getTypeHook>['schema']['base'];
    query: string;
}) {
    return Object.entries(formSchema.shape).flatMap(([key, zodType]) => {
        // Search in all string fields to include the search value, excluding the ids (uuids unknown by user).
        if (zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString && !key.includes('id')) {
            return [
                {
                    [key]: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        return [];
    });
}
