import { Prisma } from '@prisma/client';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { toast } from 'react-toastify';
import { typeHooks } from '@/zmodel/lib/forms/typeHooks';
import { Type } from '@zenstackhq/runtime/models';
import { AnyZodObject, z } from 'zod';
import { FieldConfig, FieldConfigItem } from '@/components/ui/auto-form/types';

export const GridCardFooterButtonInclude = true;

export function GridCardFooterButton({
    button,
}: {
    button: Prisma.GridCardFooterButtonGetPayload<typeof GridCardFooterButtonInclude>;
}) {
    const typeHook = typeHooks[button.table];

    const create = typeHook.useCreate.single();

    type Dependency = {
        key: string;
        type: Type;
        array: boolean;
        optional: boolean;
        mode: 'connect' | 'create';
    };
    const formDefinition: {
        mode: 'create' | 'update' | 'view';
        parents: Dependency[];
        type: Type;
        children: Dependency[];
    } = {
        mode: 'create',
        parents: [
            {
                key: 'propertyId',
                type: 'Property',
                array: false,
                optional: false,
                mode: 'connect',
            },
        ],
        type: 'Lease',
        children: [
            {
                key: 'mailOtherAddresses',
                type: 'LeaseMailOtherAddress',
                mode: 'connect',
                array: true,
                optional: true,
            },
            // Payment, Charges, tenant
        ],
    };

    const formSchema = formDefinition.children.reduce(
        (schema, dependency) => reduceDependency({ schema, dependency }),
        formDefinition.parents
            .reduce((schema, dependency) => reduceDependency({ schema, dependency }), z.object({}))
            .extend(typeHooks[formDefinition.type].schema.create.shape)
    );

    const fieldConfig = formDefinition.children.reduce(
        (config, dependency) => reduceDependencyConfig({ config, dependency }),
        formDefinition.parents.reduce(
            (config, dependency) => reduceDependencyConfig({ config, dependency }),
            {} as FieldConfig<AnyZodObject>
        )
    );

    return (
        <AutoFormDialog
            formSchema={formSchema}
            fieldConfig={fieldConfig}
            onSubmitData={async (data) => {
                // @ts-ignore
                await create.mutateAsync({ data });
                toast.success(`${button.table} created successfully!`);
            }}
            title={button.text}
        />
    );

    function reduceDependency({
        schema,
        dependency: { mode, array, optional, key, type },
    }: {
        schema: AnyZodObject;
        dependency: Dependency;
    }) {
        switch (mode) {
            case 'connect':
                if (array) {
                    if (optional) {
                        schema = schema.extend({
                            [key]: z.object({ connect: z.array(z.string()).optional() }),
                        });
                    } else {
                        schema = schema.extend({
                            [key]: z.object({ connect: z.array(z.string()) }),
                        });
                    }
                } else {
                    if (optional) {
                        schema = schema.extend({
                            [key]: z.object({ connect: z.string().optional() }),
                        });
                    } else {
                        schema = schema.extend({
                            [key]: z.object({ connect: z.string() }),
                        });
                    }
                }
                break;
            case 'create':
                if (array) {
                    if (optional) {
                        schema = schema.extend({
                            [key]: z.object({ createMany: z.array(typeHooks[type].schema.create).optional() }),
                        });
                    } else {
                        schema = schema.extend({
                            [key]: z.object({ createMany: z.array(typeHooks[type].schema.create) }),
                        });
                    }
                } else {
                    if (optional) {
                        schema = schema.extend({
                            [key]: z.object({ create: typeHooks[type].schema.create.optional() }),
                        });
                    } else {
                        schema = schema.extend({
                            [key]: z.object({ create: typeHooks[type].schema.create }),
                        });
                    }
                }

                break;
        }
        return schema;
    }

    function reduceDependencyConfig({
        config,
        dependency: { mode, array, optional, key, type },
    }: {
        config: FieldConfig<Record<string, any>>;
        dependency: Dependency;
    }) {
        config[key] = {
            [mode]: {
                fieldType: 'search',
                search: {
                    enableMultiRowSelection: array,
                    optional,
                    type,
                },
            },
        };
        return config;
    }
}
