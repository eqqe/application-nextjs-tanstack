'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableViewOptions } from './data-table-view-options';
import { Dispatch, SetStateAction } from 'react';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export type FilterState = {
    filterState?: {
        filter: string;
        setFilter: Dispatch<SetStateAction<string>>;
    };
};

export function DataTableToolbar<TData>({ table, filterState }: DataTableToolbarProps<TData> & FilterState) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {filterState && (
                    <Input
                        placeholder="Filter..."
                        value={filterState.filter}
                        onChange={(event) => filterState.setFilter(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <Cross2Icon className="ml-2 size-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
