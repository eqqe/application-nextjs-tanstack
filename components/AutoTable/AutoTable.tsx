import { z } from 'zod';
import { DataTable, Id } from '@/components/ui/data-table/data-table';
import { handleIfZodNumber } from '@/components/ui/auto-form/fields/object';
import { ZodObjectOrWrapped, getBaseSchema, getBaseType, getObjectFormSchema } from '@/components/ui/auto-form/utils';
import { CommonFormTable } from '../ui/auto-common/types';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { ColumnDef, TableOptions, TableState } from '@tanstack/react-table';
import { ReactNode, useMemo } from 'react';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';

export function AutoTable<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    additionalColumns,
    data,
    onlyAdditionalColumns,
    type,
    state,
}: CommonFormTable<SchemaType> &
    Omit<TableOptions<z.infer<SchemaType> & Id>, 'columns' | 'getCoreRowModel'> & {
        additionalColumns?: ColumnDef<z.infer<SchemaType> & Id, ReactNode>[];
        data: (Partial<z.infer<SchemaType>> & Id)[];
        onlyAdditionalColumns?: boolean;
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
    ): ColumnDef<z.infer<SchemaType> & Id, ReactNode>[] {
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

            return [getColumnDef({ currentPrefix, zodBaseType, link: true, enableSorting: false })];
        });
    }

    const columns = onlyAdditionalColumns
        ? additionalColumns ?? []
        : getAccessor(objectFormSchema).concat(additionalColumns ?? []);

    return <DataTable<z.infer<SchemaType> & Id> state={state} columns={columns} data={data} getRowLink={getRowLink} />;
}
