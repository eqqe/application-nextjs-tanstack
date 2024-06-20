import { useCreatePropertyTenancy } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { z } from 'zod';
import {
    PropertyJointTenancyCreateScalarSchema,
    PropertyTenancyByEntiretyCreateScalarSchema,
    PropertyTenancyCreateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();
    return (
        <AutoFormDialog
            formSchema={z.object({
                tenancy: PropertyTenancyCreateScalarSchema,
                tenancyInCommon: PropertyTenancyInCommonCreateScalarSchema,
            })}
            onSubmitData={async (data) => {
                await create.mutateAsync({
                    data: {
                        ...data.tenancy,
                        ...(data.tenancy.tenancyType === 'InCommon' && {
                            tenancyInCommon: {
                                create: data.tenancyInCommon,
                            },
                        }),
                    },
                });
                toast.success(`${data.tenancy.name} created successfully!`);
            }}
            title={'Create Property Tenancy'}
        />
    );
}
