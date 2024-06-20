import { useCreateLease, useFindManyProperty } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';

export function LeaseForm() {
    const create = useCreateLease();
    const { data: properties } = useFindManyProperty();

    return (
        <AutoFormDialog
            formSchema={LeaseCreateScalarSchema.extend({ propertyId: z.enum(properties?.map((p) => p.id)) })}
            onSubmitData={async (data) => {
                // @ts-ignore
                await create.mutateAsync({ data });
                toast.success(`Lease created successfully!`);
            }}
            title={'Create a lease'}
        />
    );
}
