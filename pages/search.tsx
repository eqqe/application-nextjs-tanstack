import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { z } from 'zod';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { useSearchParams } from 'next/navigation';
import { getOrFilter } from '@/lib/getOrFilter';

export const Search: NextPage = () => {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q');
    if (!queryParam) {
        return 'Should enter a param in q query';
    }
    const query = queryParam;

    function SearchType({ type }: { type: Type }) {
        const typeHook = getTypeHook({ type });
        if (!typeHook) {
            return;
        }
        const useFindMany = typeHook.useHook.FindMany;

        const formSchema = typeHook.schema.base;
        const orFilter = getOrFilter({ formSchema, query });
        if (orFilter.length) {
            // Do not launch search if table has no string column to filter
            // @ts-expect-error
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data } = useFindMany({
                where: {
                    OR: orFilter,
                },
            });
            if (data?.length) {
                return {
                    type,
                    data,
                    formSchema,
                };
            }
        }
    }
    const content = query
        ? Object.values(Type)
              .map((type) => SearchType({ type }))
              .flatMap((res) => {
                  if (!res) {
                      return [];
                  }
                  const { type, data, formSchema } = res;
                  return [
                      <div key={type} className="pb-4">
                          <div className="p-1">{beautifyObjectName(type)}</div>
                          <AutoTable data={data} formSchema={formSchema} state={{}} />
                      </div>,
                  ];
              })
        : null;

    return <WithNavBar>{content?.length ? content : 'No result'}</WithNavBar>;
};

export default Search;
