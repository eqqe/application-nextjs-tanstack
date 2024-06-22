'use client';
import { ColumnDef, TableOptions, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../../layout/FallbackError';
import { useRouter } from 'next/router';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTablePagination } from './data-table-pagination';

export type Id = {
    id: string;
};

export function DataTable<TData extends Id>({
    columns: columnsProps,
    data,
    state,
    rowCount,
    onPaginationChange,
    onSortingChange,
    enableRowSelection,
    onGlobalFilterChange,
    onRowSelectionChange,
    enableMultiRowSelection,
    getRowLink,
}: Omit<TableOptions<TData>, 'getCoreRowModel'> & {
    getRowLink?: (id: string) => string;
}) {
    const selectColumn: ColumnDef<TData> = {
        id: 'select',
        header: ({ table }) =>
            enableMultiRowSelection ? (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ) : (
                <></>
            ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    };
    const columns = enableRowSelection ? [selectColumn, ...columnsProps] : columnsProps;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        manualFiltering: true,
        rowCount,
        state,
        enableRowSelection,
        enableMultiRowSelection,
        onPaginationChange,
        onSortingChange,
        onGlobalFilterChange,
        onRowSelectionChange,
        getRowId: (row) => row.id,
    });

    const router = useRouter();

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
            <div className="overflow-x-auto rounded-md border">
                <Table className="@apply w-full ">
                    <ErrorBoundary fallback={<FallbackError />}>
                        <TableHeader className={'bg-primary-foreground sticky top-0 [&_tr]:border-b'}>
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
            {state?.pagination && <DataTablePagination table={table} enableRowSelection={enableRowSelection} />}
        </div>
    );
}
