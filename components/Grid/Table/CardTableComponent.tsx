import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { Prisma } from '@prisma/client';
import { getTypeHook } from './getTypeHook';
import { CreateForm } from '@/components/Form/CreateForm';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { EditCardTable } from './EditCardTable';
import Link from 'next/link';
import { z } from 'zod';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { ReactNode } from 'react';
import '@tanstack/react-table';
import { useGroupByProperty } from '@/zmodel/lib/hooks';

export const GridCardTableInclude = {
    include: {
        groupBy: true,
    },
};

export type DisplayLink = {
    link: boolean;
};

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> extends DisplayLink {}
}

export type CardTableComponentProps = { table: Prisma.GridCardTableGetPayload<typeof GridCardTableInclude> };
export function CardTableComponent({ table }: CardTableComponentProps) {
    const { useHook, schema, useUpdate, getLink } = getTypeHook(table);

    function getParams() {
        function reducer(list: string[]) {
            return list.reduce<Record<string, boolean>>((previousValue, currentValue) => {
                previousValue[currentValue] = true;
                return previousValue;
            }, {});
        }
        switch (table.typeTableRequest) {
            case 'Aggregate':
                return {
                    params: {},
                    columns: table.columns,
                };
            case 'FindMany':
                return {
                    params: {
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    },
                    columns: table.columns,
                };
            case 'GroupBy':
                if (!table.groupBy) {
                    throw '! table.groupBy';
                }
                let columns = table.groupBy.fields;
                const res: any = {
                    by: table.groupBy.fields,
                };
                (['sum', 'count', 'avg', 'min', 'max'] as const).forEach((name) => {
                    if (!table.groupBy) {
                        throw '! table.groupBy';
                    }
                    const list = table.groupBy[name];
                    if (list.length) {
                        const property = `_${name}`;
                        res[property] = reducer(list);
                        columns = columns.concat(list.map((column) => `${property}.${column}`));
                    }
                });
                return { params: res, columns };
        }
    }

    const update = useUpdate.single();
    const { params, columns } = getParams();
    // @ts-expect-error
    const { data: rows } = useHook[table.typeTableRequest](params);

    if (!rows) {
        return <></>;
    }

    type ColumnDefFromSchema = ColumnDef<z.infer<typeof schema.base>, ReactNode>;
    const columnDataTable: ColumnDefFromSchema[] = columns.map((column) => ({
        accessorKey: column,
        meta: {
            link: table.typeTableRequest === 'FindMany',
        },
        header: beautifyObjectName(column),
    }));

    if (table.typeTableRequest === 'FindMany') {
        columnDataTable.push({
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => (
                <CreateForm
                    formSchema={schema.update}
                    values={row.original}
                    onSubmitData={async (data) => {
                        // @ts-expect-error
                        await update.mutateAsync({
                            data,
                            where: {
                                id: data.id,
                            },
                        });
                    }}
                    title={`Edit ${table.type}`}
                />
            ),
        });
    }
    return (
        <div className="container mx-auto py-10">
            <ErrorBoundary fallback={<FallbackError />}>
                <AutoTable
                    type={table.type}
                    formSchema={schema.base}
                    additionalColumns={columnDataTable}
                    onlyAdditionalColumns={
                        (!!table.columns.length && table.typeTableRequest === 'FindMany') ||
                        table.typeTableRequest !== 'FindMany'
                    }
                    data={rows}
                />
            </ErrorBoundary>
            <ErrorBoundary fallback={<FallbackError />}>
                <EditCardTable table={table} />
            </ErrorBoundary>
        </div>
    );
}
