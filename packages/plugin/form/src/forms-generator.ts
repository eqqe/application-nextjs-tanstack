import { type Model, ReferenceExpr, isReferenceExpr, ArrayExpr, DataModelField } from '@zenstackhq/sdk/ast';
import { getRelationKeyPairs, getAttribute, getAttributeArg } from '@zenstackhq/sdk';
import {
    type PluginOptions,
    createProject,
    ensureEmptyDir,
    getDataModels,
    requireOption,
    resolvePath,
    saveProject,
} from '@zenstackhq/sdk';
import path from 'path';
import { paramCase } from 'change-case';
import { type DMMF } from '@zenstackhq/sdk/prisma';
import { VariableDeclarationKind } from 'ts-morph';

type BaseDependency = {
    key: string;
    type: string;
};
export type Dependency = BaseDependency & {
    array: boolean;
    optional: boolean;
    minLenghtArray1: boolean;
    mode: 'connect' | 'create';
};

type Polymorphism = BaseDependency & {
    parent: Dependency;
    storeTypeField: string;
};

export type FormDefinition = {
    mode: 'create' | 'update' | 'view';
    polymorphisms: Polymorphism[];
    parents: Dependency[];
    type: string;
    children: Dependency[];
};

export const name = 'Form';

export default async function run(model: Model, options: PluginOptions, dmmf: DMMF.Document) {
    const project = createProject();
    let outDir = requireOption<string>(options, 'output', name);
    outDir = resolvePath(outDir, options);
    ensureEmptyDir(outDir);
    const warnings: string[] = [];
    const models = getDataModels(model);

    const names = models.flatMap((dataModel) => {
        if (!!getAttribute(dataModel, '@@form.ignore')) {
            return [];
        }
        const fileName = paramCase(dataModel.name);
        const sf = project.createSourceFile(path.join(outDir, `${fileName}.ts`), undefined, { overwrite: true });

        const formDefinition: FormDefinition = {
            type: dataModel.name,
            mode: 'create',
            polymorphisms: [],
            parents: [],
            children: [],
        };

        dataModel.fields.forEach((field) => {
            if (!!getAttribute(field, '@form.ignore')) {
                return;
            }

            const ref = field.type.reference?.ref;
            if (ref?.$type === 'DataModel') {
                const polymorphAttribute = getAttribute(field, '@form.polymorphism');

                if (polymorphAttribute) {
                    const polymorphRefAttribute = getAttribute(ref, '@@form.polymorphism');

                    if (polymorphRefAttribute) {
                        const parentField = getAttributeArg(polymorphRefAttribute, 'parentField');

                        if (isReferenceExpr(parentField)) {
                            const parent = parentField.target.ref;
                            if (parent?.$type === 'DataModelField') {
                                const typeFieldArg = getAttributeArg(polymorphRefAttribute, 'typeField');
                                if (isReferenceExpr(typeFieldArg)) {
                                    const storeTypeField = typeFieldArg.target.ref?.name;
                                    if (!storeTypeField) {
                                        throw '!storeFieldType';
                                    }
                                    const parentType = parent.type.reference?.ref?.name;
                                    if (!parentType) {
                                        throw '!parentType';
                                    }
                                    const { key, minLenghtArray1 } = getKeyAndMinLenghtArray1(parent);
                                    formDefinition.polymorphisms.push({
                                        key: field.name,
                                        type: ref.name,
                                        storeTypeField,
                                        parent: {
                                            key,
                                            array: parent.type.array,
                                            mode: 'connect',
                                            optional: parent.type.optional,
                                            minLenghtArray1,
                                            type: parentType,
                                        },
                                    });
                                }
                            }
                        }
                    } else {
                        warnings.push(`Should also define @@form.polymorphism on ${ref.name}`);
                    }
                } else {
                    const type = field.type.reference?.ref?.name;
                    if (!type) {
                        throw '!type';
                    }

                    const { key, minLenghtArray1 } = getKeyAndMinLenghtArray1(field);

                    const dependency: Dependency = {
                        key,
                        array: field.type.array,
                        mode: 'connect',
                        optional: field.type.optional,
                        minLenghtArray1,
                        type,
                    };
                    if (field.type.array) {
                        formDefinition.children.push(dependency);
                    } else {
                        formDefinition.parents.push(dependency);
                    }
                }
            }
        });

        sf.addStatements('/* eslint-disable */');
        sf.addStatements(`import { FormDefinition } from '@/lib/formDefinition';`);

        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}CreateForm`,
                    initializer: JSON.stringify(formDefinition),
                    type: 'FormDefinition',
                },
            ],
        });

        return [`${dataModel.name}`];
    });

    const sf = project.createSourceFile(path.join(outDir, `typeHooks.tsx`), undefined, { overwrite: true });

    sf.addStatements('/* eslint-disable */');
    const schemas = names.flatMap((name) => [
        `${name}ScalarSchema`,
        `${name}CreateScalarSchema`,
        `${name}UpdateScalarSchema`,
    ]);
    sf.addStatements(`import { ${schemas.join(',')} } from '@zenstackhq/runtime/zod/models';`);

    const hooks = names.flatMap((name) => [
        `useAggregate${name}`,
        `useGroupBy${name}`,
        `useFindMany${name}`,
        `useCount${name}`,
        `useUpdate${name}`,
        `useUpdateMany${name}`,
        `useCreate${name}`,
        `useCreateMany${name}`,
    ]);
    sf.addStatements(`import { ${hooks.join(',')} } from '@/zmodel/lib/hooks';
                     import { Type } from '@zenstackhq/runtime/models';
                     import { type FormDefinition } from '@/lib/formDefinition';
                     import { AnyZodObject } from 'zod';`);

    names.forEach((name) => {
        sf.addStatements(`import { ${name}CreateForm } from '@/zmodel/lib/forms/${paramCase(name)}';`);
    });

    const mappings = names
        .map(
            (name) => `
    ${name}: {
        useHook: {
            Aggregate: useAggregate${name},
            GroupBy: useGroupBy${name},
            FindMany: useFindMany${name},
        },
        schema: {
            base: ${name}ScalarSchema,
            update: ${name}UpdateScalarSchema,
            create: ${name}CreateScalarSchema,
        },
        useCount: useCount${name},
        useUpdate: {
            single: useUpdate${name},
            many: useUpdateMany${name},
        },
        useCreate: {
            single: useCreate${name},
            many: useCreateMany${name},
        },
        form: {
            create: ${name}CreateForm
        }
    }
    `
        )
        .join(',');

    sf.addVariableStatement({
        isExported: true,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: `typeHooks`,
                initializer: `{${mappings}}`,
                type: `Record<
                        Type,
                        {
                            useHook: {
                                Aggregate: Function;
                                GroupBy: Function;
                                FindMany: Function;
                            };
                            schema: {
                                base: AnyZodObject;
                                update: AnyZodObject;
                                create: AnyZodObject;
                            };
                            useCount: Function;
                            useUpdate: {
                                single: Function;
                                many: Function;
                            };
                            useCreate: {
                                single: Function;
                                many: Function;
                            };
                            form: {
                                create: FormDefinition;
                            };
                        }
                    >`,
            },
        ],
    });
    await saveProject(project);

    return { warnings };
}

function getKeyAndMinLenghtArray1(field: DataModelField) {
    const minLenghtArray1 = !!getAttribute(field, '@form.minLenghtArray1');

    const key = field.name;

    return { minLenghtArray1, key };
}
