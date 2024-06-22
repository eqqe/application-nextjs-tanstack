import { useCreateLease } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseCreateSchema } from '@zenstackhq/runtime/zod/models';
import { Prisma, Type } from '@prisma/client';

export function LeaseForm() {
    const create = useCreateLease();

    const where: Prisma.PropertyWhereInput = {};

    return (
        <AutoFormDialog
            formSchema={LeaseCreateSchema}
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
