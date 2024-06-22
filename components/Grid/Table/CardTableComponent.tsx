import { Prisma } from '@prisma/client';
import { getTypeHook } from './getTypeHook';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { ColumnDef, PaginationState, RowData, SortingState } from '@tanstack/react-table';
import { z } from 'zod';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { ReactNode, useState, useMemo } from 'react';
import { Chart } from '@/components/Grid/Card/Chart';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';
import { getOrFilter } from '@/lib/getOrFilter';
import { keepPreviousData } from '@tanstack/react-query';

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

export type CardTableComponentProps = {
    table: Omit<
        Prisma.GridCardTableGetPayload<typeof GridCardTableInclude>,
        'id' | 'parentId' | 'updatedAt' | 'createdAt'
    >;
};
export function CardTableComponent({
    table: { type, typeTableRequest, columns, groupBy, chart },
    pageSize,
    editableItems,
}: CardTableComponentProps & {
    pageSize: number;
    editableItems: boolean;
}) {
    const { useHook, schema, useUpdate, useCount } = getTypeHook({ type });

    const [pagination, onPaginationChange] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const [sorting, onSortingChange] = useState<SortingState>([{ id: 'updatedAt', desc: true }]);
    const [globalFilter, onGlobalFilterChange] = useState('');
    const update = useUpdate.single();

    const params = useMemo(() => {
        function reducer(list: string[]) {
            return list.reduce<Record<string, boolean>>((previousValue, currentValue) => {
                previousValue[currentValue] = true;
                return previousValue;
            }, {});
        }
        switch (typeTableRequest) {
            case 'Aggregate':
                return {};
            case 'FindMany': {
                const orFilter = getOrFilter({ formSchema: schema.base, query: globalFilter });
                return {
                    orderBy: sorting.reduce((accumulator, currentValue) => {
                        accumulator[currentValue.id] = currentValue.desc ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;
                        return accumulator;
                    }, {} as Record<string, Prisma.SortOrder>),
                    ...(orFilter.length && {
                        where: {
                            OR: orFilter,
                        },
                    }),
                    take: pagination.pageSize,
                    skip: pagination.pageSize * pagination.pageIndex,
                };
            }
            case 'GroupBy':
                if (!groupBy) {
                    throw '! table.groupBy';
                }
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
                    }
                });
                return res;
        }
    }, [globalFilter, groupBy, pagination.pageIndex, pagination.pageSize, schema.base, sorting, typeTableRequest]);
    type ColumnDefFromSchema = ColumnDef<z.infer<typeof schema.base>, ReactNode>;
    const findMany = typeTableRequest === 'FindMany';

    const columnDataTable = useMemo(() => {
        let cols = columns;
        if (typeTableRequest === 'GroupBy') {
            if (!groupBy) {
                throw '! table.groupBy';
            }
            cols = groupBy.fields;
            groupByTypes.forEach((name) => {
                if (!groupBy) {
                    throw '! groupBy';
                }
                const list = groupBy[name];
                if (list.length) {
                    const property = `_${name}`;
                    cols = cols.concat(list.map((column) => `${property}.${column}`));
                }
            });
        }

        let colsRes: ColumnDefFromSchema[] = cols.map((column) =>
            getColumnDef({ currentPrefix: column, link: findMany, enableSorting: findMany })
        );
        if (findMany && editableItems) {
            colsRes.push({
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
        return colsRes;
    }, [columns, editableItems, findMany, groupBy, schema.update, type, typeTableRequest, update]);

    const useHookTyped = useHook[typeTableRequest];

    let rows: any[] | undefined;

    const paramLagged = { placeholderData: keepPreviousData };
    // @ts-expect-error
    rows = useHookTyped(params, paramLagged).data;

    let rowCount: number | undefined;
    // @ts-expect-error
    rowCount = useCount({ where: params.where ?? {} }).data;

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
                        onlyAdditionalColumns={(!!columns.length && findMany) || !findMany}
                        data={rows ?? []}
                        state={findMany ? { pagination, sorting, globalFilter } : {}}
                        rowCount={rowCount}
                        onPaginationChange={findMany ? onPaginationChange : void 0}
                        onSortingChange={findMany ? onSortingChange : void 0}
                        onGlobalFilterChange={findMany ? onGlobalFilterChange : void 0}
                    />
                )}
            </ErrorBoundary>
        </div>
    );
}
