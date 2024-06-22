import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { dateFormat } from '@/lib/utils';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { Id } from '../ui/data-table/data-table';

export function getColumnDef<SchemaType>({
    currentPrefix,
    zodBaseType,
    link,
    enableSorting,
}: {
    currentPrefix: string;
    zodBaseType: string;
    link: boolean;
    enableSorting: boolean;
}): ColumnDef<SchemaType & Id, ReactNode> {
    return {
        accessorKey: currentPrefix,
        header: ({ column }) => <DataTableColumnHeader column={column} title={beautifyObjectName(currentPrefix)} />,
        meta: {
            link,
        },
        cell: ({ getValue }) => {
            if (zodBaseType === 'ZodDate') {
                return dateFormat(new Date(getValue() as string));
            }
            return getValue();
        },
        enableSorting,
    };
}
