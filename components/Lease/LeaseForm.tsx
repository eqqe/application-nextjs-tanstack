import { useCreateLease } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseCreateSchema } from '@zenstackhq/runtime/zod/models';

export function LeaseForm() {
    const create = useCreateLease();

    return (
        <AutoFormDialog
            formSchema={LeaseCreateSchema}
            onSubmitData={async (data) => {
                await create.mutateAsync({ data });
                toast.success(`Lease created successfully!`);
            }}
            title={'Create a lease'}
        />
    );
}
