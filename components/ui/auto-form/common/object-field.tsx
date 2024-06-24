import React, { useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { z } from 'zod';
import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from '../config';
import { FieldConfig, FieldConfigItem } from '../types';
import { beautifyObjectName, getBaseType, zodToHtmlInputProps } from '../utils';
import AutoFormArray from '../fields/array';
import resolveDependencies from '../dependencies';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import AutoFormObject, { CommonFormObject } from '../fields/object';
import Search from '../fields/search';

export const handleIfZodNumber = (item: z.ZodAny) => {
    const isZodNumber = (item as any)._def.typeName === 'ZodNumber';
    const isInnerZodNumber = (item._def as any).innerType?._def?.typeName === 'ZodNumber';

    if (isZodNumber) {
        (item as any)._def.coerce = true;
    } else if (isInnerZodNumber) {
        (item._def as any).innerType._def.coerce = true;
    }

    return item;
};
function DefaultParent({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

function ObjectField<SchemaType extends z.ZodObject<any, any>>({
    name,
    dependencies,
    item,
    path,
    form,
    fieldConfig,
}: CommonFormObject<SchemaType> & {
    name: string;
    item: z.ZodAny;
}) {
    const { watch } = useFormContext();
    const pathArg = useMemo(() => [...(path ?? []), name], [name, path]);
    const key = useMemo(() => pathArg.join('.'), [pathArg]);

    if (['id', 'createdAt', 'updatedAt', 'ownerId'].includes(name) || !path) {
        return null;
    }
    item = handleIfZodNumber(item);
    const zodBaseType = getBaseType(item);
    const itemName = item._def.description ?? beautifyObjectName(name);

    if (!dependencies) {
        return;
    }
    const {
        isHidden,
        isDisabled,
        isRequired: isRequiredByDependency,
        overrideOptions,
    } = resolveDependencies(dependencies, name, watch);
    if (isHidden) {
        return null;
    }

    if (fieldConfig?.connect?.fieldType !== 'search') {
        if (zodBaseType === 'ZodObject') {
            return (
                <AutoFormObject
                    key={name}
                    schema={item as unknown as z.ZodObject<any, any>}
                    form={form}
                    fieldConfig={(fieldConfig?.[name] ?? {}) as FieldConfig<z.infer<typeof item>>}
                    path={pathArg}
                />
            );
        }
        if (zodBaseType === 'ZodArray') {
            return (
                <AutoFormArray
                    key={key}
                    name={name}
                    item={item as unknown as z.ZodArray<any>}
                    form={form}
                    fieldConfig={fieldConfig?.[name] ?? {}}
                    path={[...path, name]}
                />
            );
        }
    }

    const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {};
    const zodInputProps = zodToHtmlInputProps(item);
    const isRequired =
        isRequiredByDependency || zodInputProps.required || fieldConfigItem.inputProps?.required || false;

    if (overrideOptions) {
        item = z.enum(overrideOptions) as unknown as z.ZodAny;
    }

    return (
        <FormField
            control={form.control}
            name={key}
            key={key}
            render={({ field }) => {
                const inputType = fieldConfigItem.fieldType ?? DEFAULT_ZOD_HANDLERS[zodBaseType] ?? 'fallback';

                const InputComponent = typeof inputType === 'function' ? inputType : INPUT_COMPONENTS[inputType];

                const ParentElement = fieldConfigItem.renderParent ?? DefaultParent;

                const defaultValue = fieldConfigItem.inputProps?.defaultValue;
                const value = field.value ?? defaultValue ?? '';
                const fieldProps = {
                    ...zodToHtmlInputProps(item),
                    ...field,
                    ...fieldConfigItem.inputProps,
                    disabled: fieldConfigItem.inputProps?.disabled || isDisabled,
                    ref: undefined,
                    value: value,
                };

                if (InputComponent === undefined) {
                    return <></>;
                }

                return (
                    <ParentElement key={`${key}.parent`}>
                        <InputComponent
                            zodInputProps={zodInputProps}
                            field={field}
                            fieldConfigItem={fieldConfigItem}
                            label={itemName}
                            isRequired={isRequired}
                            zodItem={item}
                            fieldProps={fieldProps}
                            className={fieldProps.className}
                        />
                    </ParentElement>
                );
            }}
        />
    );
}

export default React.memo(ObjectField);
