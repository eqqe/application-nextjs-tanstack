import { useCreatePropertyTenancy } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { AnyZodObject, ZodObject, z } from 'zod';
import {
    PropertyJointTenancyCreateScalarSchema,
    PropertyTenancyByEntiretyCreateScalarSchema,
    PropertyTenancyCreateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { useEffect, useMemo, useState } from 'react';
import { fakePerson } from '@/lib/demo/fake';
import { PropertyTenancyType } from '@prisma/client';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();

    const baseSchema = PropertyTenancyCreateScalarSchema;
    const typedSchemas = {
        [PropertyTenancyType.ByEntirety]: PropertyTenancyByEntiretyCreateScalarSchema.optional(),
        [PropertyTenancyType.InCommon]: PropertyTenancyInCommonCreateScalarSchema.optional(),
        [PropertyTenancyType.Joint]: PropertyJointTenancyCreateScalarSchema.optional(),
    };
    type EnumType = PropertyTenancyType;

    const baseFormSchema = useMemo(() => z.object({ base: baseSchema }), [baseSchema]);

    const allFormsSchema = baseFormSchema.extend(typedSchemas);
    const [tenancyType, setTenancyType] = useState<EnumType | undefined>();
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
                        ...data.base,
                        ...(data.base.tenancyType === 'InCommon' && {
                            tenancyInCommon: {
                                create: data.InCommon,
                            },
                        }),
                        ...(data.base.tenancyType === 'Joint' && {
                            jointTenancy: {
                                create: data.Joint,
                            },
                        }),
                        ...(data.base.tenancyType === 'ByEntirety' && {
                            tenancyByEntirety: {
                                create: { ...data.ByEntirety, person: { create: fakePerson() } },
                            },
                        }),
                    },
                });
                toast.success(`${data.base.name} created successfully!`);
            }}
            onValuesChange={(values) => {
                if (tenancyType === values.base?.tenancyType) {
                    return;
                }
                setTenancyType(values.base?.tenancyType);
                switch (values.base?.tenancyType) {
                    case 'ByEntirety': {
                        const updateFormSchema = allFormsSchema.omit({ InCommon: true, Joint: true });
                        // @ts-expect-error
                        setFormSchema(updateFormSchema);
                        break;
                    }
                    case 'InCommon': {
                        const updateFormSchema = allFormsSchema.omit({
                            ByEntirety: true,
                            Joint: true,
                        });
                        // @ts-expect-error
                        setFormSchema(updateFormSchema);
                        break;
                    }
                    case 'Joint': {
                        const updateFormSchema = allFormsSchema.omit({
                            InCommon: true,
                            ByEntirety: true,
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
