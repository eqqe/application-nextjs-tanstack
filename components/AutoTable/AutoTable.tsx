import { z } from 'zod';
import { DataTable, Id } from '@/components/ui/data-table/data-table';
import { ZodObjectOrWrapped, getBaseSchema, getBaseType, getObjectFormSchema } from '@/components/ui/auto-form/utils';
import { CommonFormTable } from '../ui/auto-common/types';
import { Type } from '@prisma/client';
import { ColumnDef, TableOptions, TableState } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';
import { handleIfZodNumber } from '../ui/auto-form/common/object-field';

export function AutoTable<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    additionalColumns,
    data,
    onlyAdditionalColumns,
    state,
    onGlobalFilterChange,
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange,
    enableRowSelection,
    enableMultiRowSelection,
    rowCount,
}: CommonFormTable<SchemaType> &
    Omit<TableOptions<z.infer<SchemaType> & Id>, 'columns' | 'getCoreRowModel'> & {
        additionalColumns?: ColumnDef<z.infer<SchemaType> & Id, ReactNode>[];
        data: (Partial<z.infer<SchemaType>> & Id)[];
        onlyAdditionalColumns?: boolean;
    }) {
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

    return (
        <DataTable<z.infer<SchemaType> & Id>
            state={state}
            onPaginationChange={onPaginationChange}
            onGlobalFilterChange={onGlobalFilterChange}
            onSortingChange={onSortingChange}
            onRowSelectionChange={onRowSelectionChange}
            enableRowSelection={enableRowSelection}
            enableMultiRowSelection={enableMultiRowSelection}
            columns={columns}
            data={data}
            rowCount={rowCount}
        />
    );
}
