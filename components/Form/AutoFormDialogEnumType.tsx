import { AutoFormProps } from '@/components/ui/auto-form';
import { ZodRawShape, z } from 'zod';
import { useEffect, useState } from 'react';
import { AutoFormDialog } from './AutoFormDialog';

export function AutoFormDialogEnumType<
    TypedSchema extends z.ZodObject<ZodRawShape, any>,
    BaseSchema extends z.ZodObject<ZodRawShape, any>
>({
    onSubmitData,
    baseSchema,
    fieldConfig,
    title,
    typedSchemas,
}: {
    baseSchema: BaseSchema;
    typedSchemas: TypedSchema;
    onSubmitData: (data: { base: z.infer<BaseSchema> } & z.infer<TypedSchema>) => Promise<void>;
    title: string;
} & AutoFormProps<BaseSchema>) {
    const baseZodSchema = z.object({ base: baseSchema });
    const allFormsSchema = baseZodSchema.extend(typedSchemas.shape);
    const [formSchema, setFormSchema] = useState(baseZodSchema);
    const [currentType, setCurrentType] = useState<any>();
    return (
        <AutoFormDialog
            // @ts-ignore
            formSchema={formSchema}
            // @ts-ignore
            onSubmitData={onSubmitData}
            fieldConfig={fieldConfig}
            onValuesChange={(values) => {
                if (currentType === values.base?.type) {
                    return;
                } else if (!values.base?.type) {
                    setFormSchema(baseZodSchema);
                    return;
                }
                setCurrentType(values.base?.type);
                // @ts-ignore
                setFormSchema(allFormsSchema.pick({ base: true, [values.base.type]: true }));
            }}
            title={title}
        />
    );
}
