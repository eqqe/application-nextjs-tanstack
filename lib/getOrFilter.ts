import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { z } from 'zod';

export function getOrFilter({
    formSchema,
    query,
}: {
    formSchema: ReturnType<typeof getTypeHook>['schema']['base'];
    query: string;
}) {
    if (!query) {
        return [];
    }
    return Object.entries(formSchema.shape).flatMap(([key, zodType]) => {
        const isString = zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString;
        // Todo SRE : ZodEnum
        // Search in all string to include the search value, excluding the ids (uuids unknown by user).
        if (isString && !key.includes('id')) {
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
