import { CreateForm } from '@/components/Form/CreateForm';
import { CardTableComponentProps } from './CardTableComponent';
import { GridCardTableUpdateScalarSchema, GroupByUpdateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { useUpdateGridCardTable } from '@/zmodel/lib/hooks';
import { z } from 'zod';

export function EditCardTable({ table }: CardTableComponentProps) {
    const update = useUpdateGridCardTable();
    const formSchema = z.object({
        table: GridCardTableUpdateScalarSchema.extend({
            groupBy: GroupByUpdateScalarSchema.nullable(),
        }),
    });
    return (
        <CreateForm
            formSchema={formSchema}
            values={{ table }}
            onSubmitData={async ({ table: data }) => {
                await update.mutateAsync({
                    data: {
                        ...data,
                        groupBy: {
                            update: {
                                data: {
                                    ...data.groupBy,
                                },
                            },
                        },
                    },
                    where: {
                        id: data.id,
                    },
                });
            }}
            title={`Edit above table`}
        />
    );
}
