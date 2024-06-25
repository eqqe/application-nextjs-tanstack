import { type Model, isReferenceExpr } from '@zenstackhq/sdk/ast';
import { getAttribute, getAttributeArg } from '@zenstackhq/sdk';
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
import { paramCase, camelCase } from 'change-case';
import { type DMMF } from '@zenstackhq/sdk/prisma';
import { VariableDeclarationKind } from 'ts-morph';
import { buildDependency as getRelation } from './utils';

type BaseRelation = {
    referenceName: string;
};
export type Relation = BaseRelation & {
    type: 'Relation';
    array: boolean;
    optional: boolean;
    minLenghtArray1: boolean;
    backLinkName: string;
    backLinkArray: boolean;
    backLinkOptional: boolean;
};

type DelegateRelation = BaseRelation & {
    type: 'DelegateRelation';
    parent: Relation & { fieldName: string };
    storeTypeField: string;
};

export type FormDefinition = {
    relations: Record<string, Relation | DelegateRelation>;
    type: string;
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
            type: camelCase(dataModel.name),
            relations: {},
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

                                    formDefinition.relations[field.name] = {
                                        type: 'DelegateRelation',
                                        referenceName: camelCase(ref.name),
                                        storeTypeField,
                                        parent: { ...getRelation(parent), fieldName: parent.name },
                                    };
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

                    formDefinition.relations[field.name] = getRelation(field);
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
                    name: `${dataModel.name}FormDefinition`,
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

    sf.addStatements(`import { Type } from '@zenstackhq/runtime/models';
                     import { type FormDefinition } from '@/lib/formDefinition';
                     import { AnyZodObject } from 'zod';`);

    names.forEach((name) => {
        sf.addStatements(`import { ${name}FormDefinition } from '@/zmodel/lib/forms/${paramCase(name)}';`);
    });

    const mappings = names
        .map(
            (name) => `
    ${camelCase(name)}: {
        schema: {
            base: ${name}ScalarSchema,
            update: ${name}UpdateScalarSchema,
            create: ${name}CreateScalarSchema,
        },
        form: {
            create: ${name}FormDefinition
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
                            schema: {
                                base: AnyZodObject;
                                update: AnyZodObject;
                                create: AnyZodObject;
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
