import { AutoFormProps } from '@/components/ui/auto-form';
import { AnyZodObject, ZodRawShape, z } from 'zod';
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
    onSubmitData: (data: z.infer<BaseSchema> & z.infer<TypedSchema>) => Promise<void>;
    title: string;
} & AutoFormProps<BaseSchema>) {
    const allFormsSchema = baseSchema.extend(typedSchemas.shape);
    const [formSchema, setFormSchema] = useState(baseSchema);
    const [currentType, setCurrentType] = useState<any>();
    return (
        <AutoFormDialog
            // @ts-ignore
            formSchema={formSchema}
            // @ts-ignore
            onSubmitData={onSubmitData}
            fieldConfig={fieldConfig}
            // @ts-ignore
            onValuesChange={(values): undefined => {
                if (currentType === values.base?.type) {
                    return;
                } else if (!values.base?.type) {
                    setFormSchema(baseSchema);
                    return;
                }
                setCurrentType(values.base?.type);
                const picked = allFormsSchema.pick({ [values.base?.type]: true });
                const extended = baseSchema.extend(picked.shape);
                // @ts-ignore
                setFormSchema(extended);
            }}
            title={title}
        />
    );
}
