import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Type } from '@prisma/client';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';

export const Search: NextPage = () => {
    const content = Object.values(Type).flatMap((type) => {
        const table = CardTableComponent({
            table: {
                type,
                groupBy: null,
                chart: null,
                columns: [],
                typeTableRequest: 'FindMany',
            },
            pageSize: 5,
            editableItems: false,
            enableRowSelection: false,
            enableMultiRowSelection: false,
            multiTablesGlobalFilter: true,
        });
        if (table) {
            return [table];
        }
        return [];
    });

    return <WithNavBar>{content.length ? content : 'No result'}</WithNavBar>;
};

export default Search;
