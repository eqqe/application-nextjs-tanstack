'use client';
import { TableOptions, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../../layout/FallbackError';
import { useRouter } from 'next/router';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';

export type Id = {
    id: string;
};

export function DataTable<TData extends Id>({
    columns,
    data,
    state,
    rowCount,
    onPaginationChange,
    onSortingChange,
    onGlobalFilterChange,
    getRowLink,
}: Omit<TableOptions<TData>, 'getCoreRowModel'> & {
    getRowLink?: (id: string) => string;
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        manualFiltering: true,
        rowCount,
        state,
        onPaginationChange,
        onSortingChange,
        onGlobalFilterChange,
    });

    const router = useRouter();

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
            <div className="rounded-md border">
                <Table>
                    <ErrorBoundary fallback={<FallbackError />}>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                onClick={
                                                    cell.column.columnDef.meta?.link && getRowLink
                                                        ? () => router.push(getRowLink(row.original.id))
                                                        : undefined
                                                }
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </ErrorBoundary>
                </Table>
            </div>
            {state?.pagination && <DataTablePagination table={table} />}
        </div>
    );
}
