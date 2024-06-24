'use client';
import { Form } from '@/components/ui/form';
import React, { useMemo, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import AutoFormObject from './fields/object';
import { Dependency, FieldConfig } from './types';
import { ZodObjectOrWrapped, getDefaultValues, getObjectFormSchema } from './utils';
import { CommonFormTable } from '../auto-common/types';

export function AutoFormSubmit({
    children,
    className,
    disabled,
}: {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <Button type="submit" disabled={disabled} className={className}>
            {children ?? 'Submit'}
        </Button>
    );
}

export type AutoFormProps<SchemaType extends ZodObjectOrWrapped> = {
    onSubmit?: (values: z.infer<SchemaType>) => Promise<void>;
    fieldConfig?: FieldConfig<z.infer<SchemaType>>;
    children?: React.ReactNode;
    className?: string;
    dependencies?: Dependency<z.infer<SchemaType>>[];
};

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
    formSchema,
    values: valuesProp,
    onSubmit: onSubmitProp,
    fieldConfig,
    children,
    className,
    dependencies,
}: AutoFormProps<SchemaType> & CommonFormTable<SchemaType>) {
    const objectFormSchema = getObjectFormSchema(formSchema);
    const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> | null = useMemo(
        () => getDefaultValues(objectFormSchema, fieldConfig),
        [fieldConfig, objectFormSchema]
    );

    const form = useForm<z.infer<typeof objectFormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? undefined,
        values: valuesProp,
    });

    const [submitDisabled, setSubmitDisabled] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const parsedValues = formSchema.safeParse(values);
        if (parsedValues.success) {
            setSubmitDisabled(true);
            await onSubmitProp?.(parsedValues.data);
            setSubmitDisabled(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    onSubmit={(e) => {
                        form.handleSubmit(onSubmit)(e);
                    }}
                    className={cn('space-y-5', className)}
                >
                    <AutoFormObject
                        schema={objectFormSchema}
                        form={form}
                        dependencies={dependencies}
                        fieldConfig={fieldConfig}
                    />

                    {children}

                    <div className="modal-action">
                        <Button type="submit" disabled={submitDisabled}>
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default React.memo(AutoForm);
