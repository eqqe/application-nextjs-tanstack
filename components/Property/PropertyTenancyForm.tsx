import { useCreatePropertyTenancy } from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
    PersonCreateScalarSchema,
    PropertyJointTenancyCreateScalarSchema,
    PropertyTenancyByEntiretyCreateScalarSchema,
    PropertyTenancyCreateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { PropertyTenancyType } from '@prisma/client';
import { AutoFormDialogEnumType } from '../Form/AutoFormDialogEnumType';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();
    return (
        <AutoFormDialogEnumType
            baseSchema={z.object({ properties: z.string() }).extend(PropertyTenancyCreateScalarSchema.shape)}
            typedSchemas={z.object({
                [PropertyTenancyType.ByEntirety]: PropertyTenancyByEntiretyCreateScalarSchema.extend({
                    person: PersonCreateScalarSchema,
                }).optional(),
                [PropertyTenancyType.InCommon]: PropertyTenancyInCommonCreateScalarSchema.optional(),
                [PropertyTenancyType.Joint]: PropertyJointTenancyCreateScalarSchema.optional(),
            })}
            onSubmitData={async (data) => {
                await create.mutateAsync({
                    data: {
                        ...data,
                        // A bit dirty I stored the selected list separated by commas
                        properties: { connect: data.properties.split(',').map((id) => ({ id })) },
                        ...(data.type === 'InCommon' && {
                            tenancyInCommon: {
                                create: data.InCommon,
                            },
                        }),
                        ...(data.type === 'Joint' && {
                            jointTenancy: {
                                create: {},
                            },
                        }),
                        ...(data.type === 'ByEntirety' && {
                            tenancyByEntirety: {
                                create: { ...data.ByEntirety, person: { create: data.ByEntirety?.person } },
                            },
                        }),
                    },
                });
                toast.success(`${data.name} created successfully!`);
            }}
            fieldConfig={{
                properties: {
                    fieldType: 'search',
                    search: {
                        type: 'Property',
                        enableMultiRowSelection: true,
                    },
                },
            }}
            title={'Create Property Tenancy'}
        />
    );
}
