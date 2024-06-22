import { useCreateLease } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseCreateScalarSchema, LeaseCreateSchema } from '@zenstackhq/runtime/zod/models';
import { Prisma, Type } from '@prisma/client';
import { z } from 'zod';

export function LeaseForm() {
    const create = useCreateLease();

    const where: Prisma.PropertyWhereInput = {};

    return (
        <AutoFormDialog
            // We could use LeaseScalarSchema that has propertyId but it goes at the end of the form
            formSchema={z.object({ propertyId: z.string() }).extend(LeaseCreateScalarSchema.shape)}
            onSubmitData={async (data) => {
                await create.mutateAsync({ data });
                toast.success(`Lease created successfully!`);
            }}
            fieldConfig={{
                propertyId: {
                    fieldType: 'search',
                    search: {
                        type: 'Property',
                        where,
                    },
                },
            }}
            title={'Create Lease'}
        />
    );
}
