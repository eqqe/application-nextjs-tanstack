import { useCreatePropertyTenancy } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { z } from 'zod';
import { PropertyTenancyCreateScalarSchema } from '@zenstackhq/runtime/zod/models';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();
    return (
        <AutoFormDialog
            formSchema={z.object({ tenancy: PropertyTenancyCreateScalarSchema })}
            onSubmitData={async (data) => {
                await create.mutateAsync({
                    data: data.tenancy,
                });
                toast.success(`${data.tenancy.name} created successfully!`);
            }}
            title={'Create Property Tenancy'}
        />
    );
}
