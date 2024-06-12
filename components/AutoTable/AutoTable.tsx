import { z } from 'zod';
import { DataTable, Id } from '@/components/ui/data-table';
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
import { ReactNode, useMemo } from 'react';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';

export function AutoTable<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    additionalColumns,
    data,
    onlyAdditionalColumns,
    type,
}: CommonFormTable<SchemaType> & {
    additionalColumns: ColumnDef<z.infer<typeof formSchema> & Id, ReactNode>[];
    data: (Partial<z.infer<SchemaType>> & Id)[];
    onlyAdditionalColumns: boolean;
    type?: Type;
}) {
    const getRowLink = useMemo(() => (type ? getTypeHook({ type })?.getLink : undefined), [type]);
    const objectFormSchema = getObjectFormSchema(formSchema);
    if (!objectFormSchema) {
        return null;
    }
    function getAccessor(
        objectFormSchema: z.AnyZodObject,
        prefix = ''
    ): ColumnDef<z.infer<typeof formSchema> & Id, ReactNode>[] {
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
                    meta: {
                        link: true,
                    },
                },
            ];
        });
    }

    const columns = onlyAdditionalColumns ? additionalColumns : getAccessor(objectFormSchema).concat(additionalColumns);

    return <DataTable columns={columns} data={data} getRowLink={getRowLink} />;
}
