import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Type } from '@prisma/client';
import { useGetData } from '@/hooks/useGetData';
import { TypeTableRequest } from '@prisma/client';
import { useMemo } from 'react';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';

export const Search: NextPage = () => {
    const content = useMemo(
        () =>
            Object.values(Type).flatMap((type) => {
                const props = {
                    table: {
                        type,
                        groupBy: null,
                        chart: null,
                        columns: [],
                        typeTableRequest: TypeTableRequest.findMany,
                    },
                    pageSize: 5,
                    editableItems: false,
                    enableRowSelection: false,
                    enableMultiRowSelection: false,
                    multiTablesGlobalFilter: true,
                };
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const data = useGetData(props);
                if (data?.rowCount) {
                    return { data, props };
                }
                return [];
            }),
        []
    );

    // Todo SRE No Result
    return (
        <WithNavBar>
            {content.length
                ? content.map(({ data, props }) => (
                      <CardTableComponent key={props.table.type} data={data} props={props} />
                  ))
                : 'No result'}
        </WithNavBar>
    );
};

export default Search;
