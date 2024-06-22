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
            onValuesChange={(values) => {
                if (currentType === values.type) {
                    return;
                } else if (!values.type) {
                    setFormSchema(baseSchema);
                    return;
                }
                setCurrentType(values.type);
                const picked = allFormsSchema.pick({ [values.type]: true });
                const extended = baseSchema.extend(picked.shape);
                // @ts-ignore
                setFormSchema(extended);
            }}
            title={title}
        />
    );
}
