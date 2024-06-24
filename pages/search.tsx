import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Type } from '@prisma/client';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';

export const Search: NextPage = () => {
    const content = Object.values(Type).map((type) => (
        <CardTableComponent
            key={type}
            table={{
                type,
                groupBy: null,
                chart: null,
                columns: [],
                typeTableRequest: 'findMany',
            }}
            pageSize={5}
            editableItems={false}
            enableRowSelection={false}
            enableMultiRowSelection={false}
            multiTablesGlobalFilter={true}
        />
    ));

    // Todo SRE No Result
    return <WithNavBar>{content}</WithNavBar>;
};

export default Search;
