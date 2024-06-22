import { Prisma } from '@prisma/client';
import { getTypeHook } from './getTypeHook';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { ColumnDef, PaginationState, RowData, RowSelectionState, SortingState } from '@tanstack/react-table';
import { z } from 'zod';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { ReactNode, useState, useMemo, useEffect, useCallback } from 'react';
import { Chart } from '@/components/Grid/Card/Chart';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';
import { keepPreviousData } from '@tanstack/react-query';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { useSearchParams } from 'next/navigation';

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
    onRowSelection,
    enableRowSelection,
    enableMultiRowSelection,
    multiTablesGlobalFilter,
}: CardTableComponentProps & {
    pageSize: number;
    editableItems: boolean;
    onRowSelection?: (ids: { id: string }[]) => void;
    enableRowSelection: boolean;
    enableMultiRowSelection: boolean;
    multiTablesGlobalFilter?: boolean;
}) {
    const { useHook, schema, useUpdate, useCount } = getTypeHook({ type });

    const [rowSelection, setRowSelection] = useState({});

    const [pagination, onPaginationChange] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const [sorting, onSortingChange] = useState<SortingState>([{ id: 'updatedAt', desc: true }]);
    const searchParams = useSearchParams();
    const [globalFilter, onGlobalFilterChange] = useState('');

    useEffect(() => {
        const queryParam = searchParams.get('q');
        if (queryParam) {
            onGlobalFilterChange(queryParam);
        }
    }, [searchParams]);
    const update = useUpdate.single();

    const orFilter = useMemo(() => {
        if (!globalFilter) {
            return [];
        }
        return Object.entries(schema.base.shape).flatMap(([key, zodType]) => {
            const isString = zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString;
            // Todo SRE : ZodEnum
            // Search in all string to include the search value, excluding the ids (uuids unknown by user).
            if (isString && !key.includes('id')) {
                return [
                    {
                        [key]: {
                            contains: globalFilter,
                            mode: 'insensitive',
                        },
                    },
                ];
            }
            return [];
        });
    }, [globalFilter, schema.base]);
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
    }, [groupBy, orFilter, pagination.pageIndex, pagination.pageSize, sorting, typeTableRequest]);
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

        let colsRes: ColumnDefFromSchema[] = cols.map((column) => {
            let zodBaseType = 'ZodString';
            try {
                // @ts-expect-error try to restore zod type from column name
                zodBaseType = schema.base.shape[column]._def.typeName;
            } catch {
                // continue
            }

            return getColumnDef({
                currentPrefix: column,
                link: findMany,
                enableSorting: findMany,
                zodBaseType,
            });
        });
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
    }, [columns, editableItems, findMany, groupBy, schema.base.shape, schema.update, type, typeTableRequest, update]);

    const useHookTyped = useHook[typeTableRequest];

    let rows: any[] | undefined;

    const options = {
        placeholderData: keepPreviousData,
        enabled: !multiTablesGlobalFilter || !!orFilter.length,
    };
    // @ts-expect-error
    rows = useHookTyped(params, options).data;

    let rowCount: number | undefined;
    // @ts-expect-error
    rowCount = useCount({ where: params.where ?? {} }, options).data;

    if (!options.enabled || (multiTablesGlobalFilter && !rowCount)) {
        return null;
    }

    return (
        <div className="container mx-auto py-5">
            {multiTablesGlobalFilter && <div className="p-1">{beautifyObjectName(type)}</div>}
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
                        state={
                            findMany
                                ? {
                                      pagination,
                                      sorting,
                                      ...(!multiTablesGlobalFilter && { globalFilter }),
                                      rowSelection,
                                  }
                                : {}
                        }
                        rowCount={rowCount}
                        onPaginationChange={findMany ? onPaginationChange : void 0}
                        onSortingChange={findMany ? onSortingChange : void 0}
                        onGlobalFilterChange={findMany && !multiTablesGlobalFilter ? onGlobalFilterChange : void 0}
                        onRowSelectionChange={
                            enableRowSelection
                                ? (newRowSelection) => {
                                      const newValue =
                                          typeof newRowSelection === 'function'
                                              ? newRowSelection(rowSelection)
                                              : newRowSelection;
                                      if (onRowSelection) {
                                          onRowSelection(Object.keys(newValue).map((id) => id));
                                      }
                                      setRowSelection(newValue);
                                  }
                                : void 0
                        }
                        enableRowSelection={enableRowSelection}
                        enableMultiRowSelection={enableMultiRowSelection}
                    />
                )}
            </ErrorBoundary>
        </div>
    );
}
