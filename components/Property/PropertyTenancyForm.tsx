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
import { fakeJointTenancyTenant, fakePerson } from '@/lib/demo/fake';

export function PropertyTenancyForm() {
    const create = useCreatePropertyTenancy();
    return (
        <AutoFormDialogEnumType
            baseSchema={PropertyTenancyCreateScalarSchema}
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
                        ...data.base,
                        ...(data.base.type === 'InCommon' && {
                            tenancyInCommon: {
                                create: data.InCommon,
                            },
                        }),
                        ...(data.base.type === 'Joint' && {
                            jointTenancy: {},
                        }),
                        ...(data.base.type === 'ByEntirety' && {
                            tenancyByEntirety: {
                                create: { ...data.ByEntirety, person: { create: data.ByEntirety?.person } },
                            },
                        }),
                    },
                });
                toast.success(`${data.base.name} created successfully!`);
            }}
            title={'Create Property Tenancy'}
        />
    );
}
