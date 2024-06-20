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
import { useEffect, useMemo, useState } from 'react';
import { fakePerson } from '@/lib/demo/fake';
import { PropertyTenancyType } from '@zenstackhq/runtime/models';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();

    const baseFormSchema = useMemo(
        () =>
            z.object({
                tenancy: PropertyTenancyCreateScalarSchema,
            }),
        []
    );
    const allFormsSchema = baseFormSchema.extend({
        tenancyInCommon: PropertyTenancyInCommonCreateScalarSchema.optional(),
        jointTenancy: PropertyJointTenancyCreateScalarSchema.optional(),
        tenancyByEntirety: PropertyTenancyByEntiretyCreateScalarSchema.optional(),
    });
    const [tenancyType, setTenancyType] = useState<PropertyTenancyType | undefined>();
    const [formSchema, setFormSchema] = useState(allFormsSchema);
    useEffect(() => {
        // @ts-expect-error
        setFormSchema(baseFormSchema);
    }, [baseFormSchema]);
    return (
        <AutoFormDialog
            formSchema={formSchema}
            onSubmitData={async (data) => {
                await create.mutateAsync({
                    data: {
                        ...data.tenancy,
                        ...(data.tenancy.tenancyType === 'InCommon' && {
                            tenancyInCommon: {
                                create: data.tenancyInCommon,
                            },
                        }),
                        ...(data.tenancy.tenancyType === 'Joint' && {
                            jointTenancy: {
                                create: data.jointTenancy,
                            },
                        }),
                        ...(data.tenancy.tenancyType === 'ByEntirety' && {
                            tenancyByEntirety: {
                                create: { ...data.tenancyByEntirety, person: { create: fakePerson() } },
                            },
                        }),
                    },
                });
                toast.success(`${data.tenancy.name} created successfully!`);
            }}
            onValuesChange={(values) => {
                if (tenancyType === values.tenancy?.tenancyType) {
                    return;
                }
                setTenancyType(values.tenancy?.tenancyType);
                switch (values.tenancy?.tenancyType) {
                    case 'ByEntirety': {
                        const updateFormSchema = allFormsSchema.omit({ tenancyInCommon: true, jointTenancy: true });
                        // @ts-expect-error
                        setFormSchema(updateFormSchema);
                        break;
                    }
                    case 'InCommon': {
                        const updateFormSchema = allFormsSchema.omit({
                            tenancyByEntirety: true,
                            jointTenancy: true,
                        });
                        // @ts-expect-error
                        setFormSchema(updateFormSchema);
                        break;
                    }
                    case 'Joint': {
                        const updateFormSchema = allFormsSchema.omit({
                            tenancyInCommon: true,
                            tenancyByEntirety: true,
                        });
                        // @ts-expect-error
                        setFormSchema(updateFormSchema);
                        break;
                    }
                    default:
                        break;
                }
            }}
            title={'Create Property Tenancy'}
        />
    );
}
