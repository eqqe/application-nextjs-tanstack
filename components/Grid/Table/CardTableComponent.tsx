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
import { UseGetDataProps, useGetData } from '@/hooks/useGetData';

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

export type CardTableComponentProps = {
    table: Omit<
        Prisma.GridCardTableGetPayload<typeof GridCardTableInclude>,
        'id' | 'parentId' | 'updatedAt' | 'createdAt'
    >;
};

export const CardTableComponentWrapper = React.memo((props: UseGetDataProps) => {
    const data = useGetData(props);
    return <CardTableComponent data={data} props={props} />;
});

CardTableComponentWrapper.displayName = 'CardTableComponentWrapper';

export const CardTableComponent = React.memo(
    ({ data, props }: { data: ReturnType<typeof useGetData>; props: UseGetDataProps }) => {
        const [rowSelection, setRowSelection] = useState({});
        if (!data) {
            return null;
        }
        const {
            table: { type, columns, groupBy, chart },
            onRowSelection,
            enableRowSelection,
            enableMultiRowSelection,
            multiTablesGlobalFilter,
        } = props;
        const {
            rows,
            schema,
            columnDataTable,
            findMany,
            onGlobalFilterChange,
            globalFilter,
            pagination,
            sorting,
            onPaginationChange,
            onSortingChange,
            rowCount,
        } = data;

        return (
            <div className="container mx-auto py-5">
                {multiTablesGlobalFilter && <div className="p-1">{beautifyObjectName(type)}</div>}
                <ErrorBoundary fallback={<FallbackError />}>
                    {chart && groupBy ? (
                        <Chart data={rows ?? []} chart={chart} groupBy={groupBy} />
                    ) : (
                        <AutoTable
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
