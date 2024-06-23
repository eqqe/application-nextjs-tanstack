import { Accordion } from '@/components/ui/accordion';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Dependency, FieldConfig } from '../types';
import { getBaseSchema } from '../utils';
import { useMemo } from 'react';
import React from 'react';
import ObjectField from '../common/object-field';

export interface CommonFormObject<SchemaType extends z.ZodObject<any, any>> {
    form: ReturnType<typeof useForm>;
    fieldConfig?: FieldConfig<z.infer<SchemaType>>;
    path?: string[];
    dependencies?: Dependency<z.infer<SchemaType>>[];
}
function AutoFormObject<SchemaType extends z.ZodObject<any, any>>({
    schema,
    form,
    fieldConfig,
    path = [],
    dependencies = [],
}: CommonFormObject<SchemaType> & {
    schema: SchemaType | z.ZodEffects<SchemaType>;
}) {
    const { watch } = useFormContext();
    const baseSchema = useMemo(() => getBaseSchema<SchemaType>(schema) ?? void 0, [schema]);

    const shape = baseSchema?.shape;

    const content = useMemo(
        () =>
            Object.keys(shape).map((name) => (
                <ObjectField
                    key={name}
                    name={name}
                    dependencies={dependencies}
                    path={path}
                    item={shape[name] as z.ZodAny}
                    form={form}
                    fieldConfig={fieldConfig}
                />
            )),
        [dependencies, fieldConfig, form, path, shape]
    );

    if (!shape) {
        return null;
    }

    return (
        <Accordion type="multiple" className="space-y-5 border-none">
            {content}
        </Accordion>
    );
}

export default React.memo(AutoFormObject);
