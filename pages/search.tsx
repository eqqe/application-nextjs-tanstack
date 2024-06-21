import type { NextPage } from 'next';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { z } from 'zod';
import { Type } from '@prisma/client';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { AutoTable } from '@/components/AutoTable/AutoTable';

function SearchType({ type }: { type: Type }) {
    const searchValue = 'cRepe';
    const typeHook = getTypeHook({ type });
    if (!typeHook) {
        return <></>;
    }
    const useFindMany = typeHook.useHook.FindMany;

    const formSchema = typeHook.schema.base;
    const orFilter = Object.entries(formSchema.shape).flatMap(([key, zodType]) => {
        // Search in all string fields to include the search value, excluding the ids (uuids unknown by user).
        if (zodType._def.typeName === z.ZodFirstPartyTypeKind.ZodString && !key.includes('id')) {
            return [
                {
                    [key]: {
                        contains: searchValue,
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
        return (
            <div className="pb-4">
                <AutoTable data={data ?? []} formSchema={formSchema} />
            </div>
        );
    }
    return <></>;
}
export const Search: NextPage = () => {
    return (
        <WithNavBar>
            {Object.values(Type).map((type) => (
                <SearchType key={type} type={type} />
            ))}
        </WithNavBar>
    );
};

export default Search;
