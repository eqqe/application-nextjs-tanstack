import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Type } from '@prisma/client';
import { useGetData } from '@/hooks/useGetData';
import { TypeTableRequest } from '@prisma/client';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';
import { useScopedI18n } from '@/locales';
import { useGlobalFilter } from '@/hooks/useGlobalFilter';

export const Search: NextPage = () => {
    const scopedT = useScopedI18n('search');
    const content = Object.values(Type).flatMap((type) => {
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
        // It's ok to disable the rules of hooks here because the Object values do not change
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const data = useGetData(props);
        if (data?.rowCount) {
            return [{ data, props }];
        }
        return [];
    });
    const globalFilter = useGlobalFilter();

    // Todo SRE No Result
    return (
        <WithNavBar>
            {content.length
                ? content.map(({ data, props }) => (
                      <CardTableComponent key={props.table.type} data={data} props={props} />
                  ))
                : scopedT('noResult', {
                      query: globalFilter,
                  })}
        </WithNavBar>
    );
};

export default Search;
