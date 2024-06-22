import { z } from 'zod';
import { DataTable, Id } from '@/components/ui/data-table/data-table';
import { handleIfZodNumber } from '@/components/ui/auto-form/fields/object';
import { ZodObjectOrWrapped, getBaseSchema, getBaseType, getObjectFormSchema } from '@/components/ui/auto-form/utils';
import { CommonFormTable } from '../ui/auto-common/types';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';

export type TableStateProps = {
    count?: number;
    pagination?: PaginationState;
    setPagination?: Dispatch<SetStateAction<PaginationState>>;
    sorting?: SortingState;
    setSorting?: Dispatch<SetStateAction<SortingState>>;
    globalFilter?: string;
    setGlobalFilter?: Dispatch<SetStateAction<string>>;
};

export function AutoTable<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    additionalColumns,
    data,
    onlyAdditionalColumns,
    type,
    tableState,
}: CommonFormTable<SchemaType> & {
    additionalColumns?: ColumnDef<z.infer<typeof formSchema> & Id, ReactNode>[];
    data: (Partial<z.infer<SchemaType>> & Id)[];
    onlyAdditionalColumns?: boolean;
    type?: Type;
    tableState?: TableStateProps;
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

            return [getColumnDef({ currentPrefix, zodBaseType, link: true, enableSorting: false })];
        });
    }

    const columns = onlyAdditionalColumns
        ? additionalColumns ?? []
        : getAccessor(objectFormSchema).concat(additionalColumns ?? []);

    return <DataTable tableState={tableState} columns={columns} data={data} getRowLink={getRowLink} />;
}
