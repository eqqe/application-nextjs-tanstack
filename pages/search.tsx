import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { z } from 'zod';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { useSearchParams } from 'next/navigation';

export const Search: NextPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    function SearchType({ type }: { type: Type }) {
        const typeHook = getTypeHook({ type });
        if (!typeHook) {
            return;
        }
        const useFindMany = typeHook.useHook.FindMany;

        const formSchema = typeHook.schema.base;
        const orFilter = Object.entries(formSchema.shape).flatMap(([key, zodType]) => {
            // Search in all string fields to include the search value, excluding the ids (uuids unknown by user).
            if (zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString && !key.includes('id')) {
                return [
                    {
                        [key]: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ];
            }
            return [];
        });
        if (orFilter.length) {
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
                          <AutoTable data={data} formSchema={formSchema} />
                      </div>,
                  ];
              })
        : null;

    return <WithNavBar>{content?.length ? content : 'No result'}</WithNavBar>;
};

export default Search;
