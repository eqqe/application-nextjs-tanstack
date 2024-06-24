import { Prisma } from '@prisma/client';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { ColumnDef, PaginationState, RowData, RowSelectionState, SortingState } from '@tanstack/react-table';
import { AnyZodObject, z } from 'zod';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { ReactNode, useState, useMemo, useEffect, useCallback } from 'react';
import { Chart } from '@/components/Grid/Card/Chart';
import { getColumnDef } from '@/components/AutoTable/getColumnDef';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { useSearchParams } from 'next/navigation';
import { typeHooks } from '@/zmodel/lib/forms/typeHooks';
import React from 'react';
import { trpc } from '@/lib/trpc';

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

export const CardTableComponent = React.memo(
    ({
        table: { type, typeTableRequest, columns, groupBy, chart },
        pageSize,
        editableItems,
        onRowSelection,
        enableRowSelection,
        enableMultiRowSelection,
        multiTablesGlobalFilter,
        where,
    }: CardTableComponentProps & {
        pageSize: number;
        editableItems: boolean;
        onRowSelection?: (ids: string[]) => void;
        enableRowSelection: boolean;
        enableMultiRowSelection: boolean;
        multiTablesGlobalFilter?: boolean;
        where?: any;
    }) => {
        const { schema } = typeHooks[type];

        const useUpdateMutation = trpc[type].update.useMutation;

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

        // @ts-expect-error Here we cannot define the args of the mutation for any type
        const update = useUpdateMutation();

        const orFilter = useMemo(() => {
            if (!globalFilter) {
                return [];
            }
            return Object.entries(schema.base.shape).flatMap(([key, zodType]) => {
                // @ts-ignore
                const isString = zodType && zodType._def && zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString;
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
                case 'aggregate':
                    return {};
                case 'findMany': {
                    return {
                        orderBy: sorting.reduce((accumulator, currentValue) => {
                            accumulator[currentValue.id] = currentValue.desc
                                ? Prisma.SortOrder.desc
                                : Prisma.SortOrder.asc;
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
                case 'groupBy':
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
        type ColumnDefFromSchema = ColumnDef<any, ReactNode>;
        const findMany = typeTableRequest === 'findMany';

        const columnDataTable = useMemo(() => {
            let cols = columns;
            if (typeTableRequest === 'groupBy') {
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
        }, [
            columns,
            editableItems,
            findMany,
            groupBy,
            schema.base.shape,
            schema.update,
            type,
            typeTableRequest,
            update,
        ]);

        let rows: any[] | undefined;

        const options = {
            keepPreviousData: true,
            enabled: !multiTablesGlobalFilter || !!orFilter.length,
        };

        if (where) {
            params.where = { ...params.where, ...where };
        }

        const useTypedQuery = trpc[type][typeTableRequest].useQuery;

        // @ts-expect-error
        rows = useTypedQuery(params, options).data;

        let rowCount: number | undefined;

        const useCountQuery = trpc[type].count.useQuery;

        // @ts-expect-error
        rowCount = useCountQuery({ where: params.where ?? {} }, options).data;

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
);

CardTableComponent.displayName = 'CardTableComponent';
