import { useCreateLeaseTenant } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { LeaseTenantCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';

export function LeaseTenantForm() {
    const create = useCreateLeaseTenant();

    return (
        <AutoFormDialog
            // We could use LeaseScalarSchema that has propertyId but it goes at the end of the form
            formSchema={z.object({ leaseId: z.string() }).extend(LeaseTenantCreateScalarSchema.shape)}
            onSubmitData={async (data) => {
                await create.mutateAsync({ data });
                toast.success(`Lease Tenant created successfully!`);
            }}
            fieldConfig={{
                leaseId: {
                    fieldType: 'search',
                    search: {
                        type: 'Lease',
                        enableMultiRowSelection: false,
                    },
                },
            }}
            title={'Create Lease Tenant'}
        />
    );
}
