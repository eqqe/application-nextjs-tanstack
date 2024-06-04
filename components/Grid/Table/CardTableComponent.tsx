import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { DataTable } from '@/components/ui/data-table';
import { Prisma } from '@prisma/client';
import { getTypeHook } from './hooks';

export const GridCardTableInclude = {};

export function CardTableComponent({ table }: { table: Prisma.GridCardTableGetPayload<typeof GridCardTableInclude> }) {
    const { useFindMany } = getTypeHook(table);

    // @ts-expect-error useFindMany is called with 0 arguments valid in all cases
    const { data: rows } = useFindMany();

    if (!rows) {
        return <></>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={table.columns.map((column) => ({ accessorKey: column, header: beautifyObjectName(column) }))}
                data={rows}
            />
        </div>
    );
}
