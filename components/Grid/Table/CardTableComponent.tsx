import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { DataTable } from '@/components/ui/data-table';
import { Prisma } from '@prisma/client';
import { getTypeHook } from './getTypeHook';

export const GridCardTableInclude = {
    include: {
        groupBy: true,
    },
};

export function CardTableComponent({ table }: { table: Prisma.GridCardTableGetPayload<typeof GridCardTableInclude> }) {
    const useHook = getTypeHook(table);

    function getParams() {
        switch (table.typeTableRequest) {
            case 'Aggregate':
                return {};
            case 'FindMany':
                return {};
            case 'GroupBy':
                if (!table.groupBy) {
                    throw '! table.groupBy';
                }
                return {
                    by: table.groupBy.fields,
                };
        }
    }

    // @ts-expect-error
    const { data: rows } = useHook(getParams());

    console.log(rows);

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
