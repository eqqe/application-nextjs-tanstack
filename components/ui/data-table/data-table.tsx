'use client';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '../../layout/FallbackError';
import { useRouter } from 'next/router';
import { PaginationProps } from '../../AutoTable/AutoTable';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Id = {
    id: string;
};

interface DataTableProps<TData extends Id, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    getRowLink?: (id: string) => string;
    pagination?: PaginationProps;
}

export function DataTable<TData extends Id, TValue>({
    columns,
    data,
    getRowLink,
    pagination,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: pagination?.count,
        state: {
            pagination: pagination?.pagination,
        },
        onPaginationChange: pagination?.setPagination,
    });

    const router = useRouter();

    const currentPageNumber = pagination?.pagination ? pagination.pagination.pageIndex + 1 : undefined;

    return (
        <>
            {pagination && (
                <div className="flex cursor-default items-center justify-end space-x-2 py-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    aria-disabled={!table.getCanPreviousPage()}
                                    className={
                                        table.getCanPreviousPage() ? undefined : 'pointer-events-none opacity-50'
                                    }
                                />
                            </PaginationItem>
                            {currentPageNumber && currentPageNumber > 2 && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => table.setPageIndex(0)}>{1}</PaginationLink>
                                </PaginationItem>
                            )}
                            {currentPageNumber && currentPageNumber > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {currentPageNumber && currentPageNumber > 1 && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => table.setPageIndex(currentPageNumber - 2)}>
                                        {currentPageNumber - 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive={true}>{currentPageNumber}</PaginationLink>
                            </PaginationItem>
                            {currentPageNumber && currentPageNumber < table.getPageCount() && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => table.setPageIndex(currentPageNumber)}>
                                        {currentPageNumber + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            {currentPageNumber && currentPageNumber + 2 < table.getPageCount() && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {currentPageNumber && currentPageNumber + 1 < table.getPageCount() && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                                        {table.getPageCount()}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    aria-disabled={!table.getCanNextPage()}
                                    className={table.getCanNextPage() ? undefined : 'pointer-events-none opacity-50'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <div className="rounded-md border">
                <ScrollArea className="max-h-[300px] rounded-md">
                    <Table>
                        <ErrorBoundary fallback={<FallbackError />}>
                            <TableHeader className={'bg-primary-foreground sticky top-0 [&_tr]:border-b'}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
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
                </ScrollArea>
            </div>
        </>
    );
}
