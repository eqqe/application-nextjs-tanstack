import { Prisma } from '@prisma/client';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { toast } from 'react-toastify';
import { typeHooks } from '@/zmodel/lib/forms/typeHooks';
import { AnyZodObject, z } from 'zod';
import { FieldConfig } from '@/components/ui/auto-form/types';
import { Relation } from '@/lib/formDefinition';
import { trpc } from '@/lib/trpc';

export const GridCardFooterButtonInclude = true;

export function GridCardFooterButton({
    button,
}: {
    button: Prisma.GridCardFooterButtonGetPayload<typeof GridCardFooterButtonInclude>;
}) {
    const useCreateMutation = trpc[button.table].create.useMutation;
    // @ts-expect-error
    const create = useCreateMutation();
    const formDefinition = typeHooks[button.table].form.create;
    const formSchema = Object.entries(formDefinition.relations)
        .reduce((schema, [fieldName, relation]) => {
            switch (relation.type) {
                case 'Relation':
                    return reduceRelation({ schema, fieldName, relation });
                case 'DelegateRelation':
                    const { parent, referenceName, storeTypeField } = relation;

                    let delegateSchema = typeHooks[referenceName].schema.create;
                    delegateSchema = reduceRelation({ schema: delegateSchema, fieldName, relation: parent });

                    return schema.extend({
                        [fieldName]: z.object({
                            create: delegateSchema.extend({
                                [storeTypeField]: z.enum([formDefinition.type]).default(formDefinition.type),
                            }),
                        }),
                    });
            }
        }, z.object({}))
        .extend(typeHooks[formDefinition.type].schema.create.shape);

    const fieldConfig = Object.entries(formDefinition.relations).reduce((config, [fieldName, relation]) => {
        switch (relation.type) {
            case 'Relation':
                return reduceRelationConfig({ config, fieldName, relation });
            case 'DelegateRelation':
                config[fieldName] = {
                    create: reduceRelationConfig({
                        config: {},
                        fieldName: relation.referenceName,
                        relation: relation.parent,
                    }),
                };
                return config;
        }
    }, {} as Record<string, any>);

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

    function reduceRelation({
        schema,
        fieldName,
        relation: { array, optional, minLenghtArray1 },
    }: {
        schema: AnyZodObject;
        fieldName: string;
        relation: Relation;
    }) {
        if (array) {
            if (minLenghtArray1) {
                schema = schema.extend({
                    [fieldName]: z.object({
                        connect: z
                            .array(z.object({ id: z.string() }))
                            .min(1)
                            .default([]),
                    }),
                });
            } else {
                schema = schema.extend({
                    [fieldName]: z.object({ connect: z.array(z.object({ id: z.string() })).default([]) }),
                });
            }
        } else {
            if (optional) {
                schema = schema.extend({
                    [fieldName]: z.object({ connect: z.object({ id: z.string() }).optional() }),
                });
            } else {
                schema = schema.extend({
                    [fieldName]: z.object({ connect: z.object({ id: z.string() }) }),
                });
            }
        }
        return schema;
    }

    function reduceRelationConfig({
        config,
        fieldName,
        relation: { array, optional, type, backLinkName, backLinkArray, referenceName },
    }: {
        config: FieldConfig<Record<string, any>>;
        fieldName: string;
        relation: Relation;
    }) {
        config[fieldName] = {
            ['connect']: {
                fieldType: 'search',
                search: {
                    enableMultiRowSelection: array,
                    optional,
                    type: referenceName,
                    where: backLinkArray
                        ? {}
                        : {
                              [backLinkName]: null,
                          },
                },
            },
        };
        return config;
    }
}
