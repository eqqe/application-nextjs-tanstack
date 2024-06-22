import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { Prisma } from '@prisma/client';
import { getTypeHook } from './getTypeHook';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { ColumnDef, PaginationState, RowData } from '@tanstack/react-table';
import { z } from 'zod';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { ReactNode, useState } from 'react';
import { Chart } from '@/components/Grid/Card/Chart';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';

export const GridCardTableInclude = {
    include: {
        groupBy: true,
        chart: true,
    },
};

export type DisplayLink = {
    link: boolean;
};

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> extends DisplayLink {}
}
export const groupByTypes = ['sum', 'count', 'avg', 'min', 'max'] as const;

export type CardTableComponentProps = { table: Prisma.GridCardTableGetPayload<typeof GridCardTableInclude> };
export function CardTableComponent({
    table: { type, typeTableRequest, columns, groupBy, chart },
}: CardTableComponentProps) {
    const { useHook, schema, useUpdate, useCount } = getTypeHook({ type });

    let count: number | undefined;
    // @ts-expect-error
    count = useCount().data;
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });

    function getParams() {
        function reducer(list: string[]) {
            return list.reduce<Record<string, boolean>>((previousValue, currentValue) => {
                previousValue[currentValue] = true;
                return previousValue;
            }, {});
        }
        switch (typeTableRequest) {
            case 'Aggregate':
                return {
                    params: {},
                    columns,
                };
            case 'FindMany':
                return {
                    params: {
                        orderBy: {
                            updatedAt: 'desc',
                        },

                        take: pagination.pageSize,
                        skip: pagination.pageSize * pagination.pageIndex,
                    },
                    columns,
                };
            case 'GroupBy':
                if (!groupBy) {
                    throw '! table.groupBy';
                }
                let cols = groupBy.fields;
                const res: any = {
                    by: groupBy.fields,
                };
                groupByTypes.forEach((name) => {
                    if (!groupBy) {
                        throw '! groupBy';
                    }
                    const list = groupBy[name];
                    if (list.length) {
                        const property = `_${name}`;
                        res[property] = reducer(list);
                        cols = cols.concat(list.map((column) => `${property}.${column}`));
                    }
                });
                return { params: res, columns: cols };
        }
    }

    const update = useUpdate.single();
    const { params, columns: cols } = getParams();

    const useHookTyped = useHook[typeTableRequest];

    let rows: any[] | undefined;
    // @ts-expect-error
    rows = useHookTyped(params).data;

    type ColumnDefFromSchema = ColumnDef<z.infer<typeof schema.base>, ReactNode>;
    const columnDataTable: ColumnDefFromSchema[] = cols.map((column) =>
        getColumnDef({ currentPrefix: column, link: typeTableRequest === 'FindMany' })
    );

    if (typeTableRequest === 'FindMany') {
        columnDataTable.push({
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => (
                <AutoFormDialog
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
                    title={`Edit ${type}`}
                />
            ),
        });
    }

    return (
        <div className="container mx-auto py-5">
            <ErrorBoundary fallback={<FallbackError />}>
                {chart && groupBy ? (
                    <Chart data={rows ?? []} chart={chart} groupBy={groupBy} />
                ) : (
                    <AutoTable
                        type={type}
                        formSchema={schema.base}
                        additionalColumns={columnDataTable}
                        onlyAdditionalColumns={
                            (!!columns.length && typeTableRequest === 'FindMany') || typeTableRequest !== 'FindMany'
                        }
                        data={rows ?? []}
                        pagination={typeTableRequest === 'FindMany' ? { pagination, setPagination, count } : void 0}
                    />
                )}
            </ErrorBoundary>
        </div>
    );
}
