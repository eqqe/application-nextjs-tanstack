import { z } from 'zod';
import { DataTable } from '@/components/ui/data-table';
import { handleIfZodNumber } from '@/components/ui/auto-form/fields/object';
import {
    ZodObjectOrWrapped,
    beautifyObjectName,
    getBaseSchema,
    getBaseType,
    getObjectFormSchema,
} from '@/components/ui/auto-form/utils';
import { CommonFormTable } from '../ui/auto-common/types';
import { ColumnDef } from '@tanstack/react-table';

export function AutoTable<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    additionalColumns,
    data,
}: CommonFormTable<SchemaType> & {
    additionalColumns: ColumnDef<z.infer<typeof formSchema>>[];
    data: Partial<z.infer<SchemaType>>[];
}) {
    const objectFormSchema = getObjectFormSchema(formSchema);
    if (!objectFormSchema) {
        return null;
    }
    function getAccessor(objectFormSchema: z.AnyZodObject, prefix = ''): ColumnDef<z.infer<typeof formSchema>>[] {
        const { shape } = getBaseSchema(objectFormSchema) || {};

        if (!shape) {
            return [];
        }

        return Object.keys(shape).flatMap((name) => {
            if (['id', 'createdAt'].includes(name)) {
                return [];
            }

            let item = shape[name] as z.ZodAny;
            item = handleIfZodNumber(item);
            const zodBaseType = getBaseType(item);
            const currentPrefix = `${prefix}${prefix ? '.' : ''}${name}`;

            if (zodBaseType === 'ZodObject') {
                return getAccessor(item as unknown as z.AnyZodObject, currentPrefix);
            } else if (zodBaseType === 'ZodArray') {
                return [];
            }

            return [
                {
                    accessorKey: currentPrefix,
                    header: beautifyObjectName(currentPrefix),
                },
            ];
        });
    }

    return <DataTable columns={getAccessor(objectFormSchema).concat(additionalColumns)} data={data} />;
}
