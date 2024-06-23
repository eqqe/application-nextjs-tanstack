import { useCreateLease } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseFormConfig } from '@/zmodel/lib/forms/lease';

export function LeaseForm() {
    const create = useCreateLease();
    return (
        <AutoFormDialog
            formSchema={LeaseFormConfig.formSchema}
            onSubmitData={async (data) => {
                await create.mutateAsync({ data });
                toast.success(`Lease created successfully!`);
            }}
            fieldConfig={LeaseFormConfig.fieldConfig}
            title={'Create Lease'}
        />
    );
}
