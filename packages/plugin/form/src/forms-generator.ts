import { type Model, ReferenceExpr, DataModelField } from '@zenstackhq/sdk/ast';
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

export const name = 'Form';

export default async function run(model: Model, options: PluginOptions, dmmf: DMMF.Document) {
    const project = createProject();
    let outDir = requireOption<string>(options, 'output', name);
    outDir = resolvePath(outDir, options);
    ensureEmptyDir(outDir);
    const warnings: string[] = [];
    const models = getDataModels(model);

    /*models.map((dataModel) => {
        const fileName = paramCase(dataModel.name);
        const sf = project.createSourceFile(path.join(outDir, `${fileName}.ts`), undefined, { overwrite: true });

        const fieldsConfigs: string[] = [];
        const topRefs: string[] = [];
        const lowRefs: string[] = [];
        const polymorphModels: string[] = [];
        dataModel.fields.forEach((field) => {
            if (field.name === 'owner' || field.name === 'space') {
                return;
            }
            const ref = field.type.reference?.ref;
            if (ref?.$type === 'DataModel') {
                const polymorphAttribute = field.attributes.find(
                    (attribute) => attribute.decl.ref?.name === '@form.polymorphism'
                );

                function getFieldConfigSearch(fieldConnect: DataModelField) {
                    const searchValue = `{
                        fieldType: 'search',
                        search: {
                            type: '${fieldConnect?.type.reference?.ref?.name}',
                            enableMultiRowSelection: ${fieldConnect.type.array},
                            optional: ${fieldConnect.type.optional}
                        }
                        }`;
                    if (fieldConnect.type.array) {
                        return `${fieldConnect.name}: {
                            connect: ${searchValue}
                        }`;
                    }
                    return `${fieldConnect.name}: ${searchValue}`;
                }

                if (polymorphAttribute) {
                    polymorphModels.push(ref.name);
                    const polymorphRefAttribute = ref.attributes.find(
                        (attribute) => attribute.decl.ref?.name === '@@form.polymorphism'
                    );
                    if (!polymorphRefAttribute) {
                        warnings.push(`Should also define @@form.polymorphism on ${ref.name}`);
                    }

                    const parent = (polymorphRefAttribute?.args[1].value as ReferenceExpr).target.ref;
                    if (parent?.$type === 'DataModelField') {
                        // TODO SRE : filter out already associated parents (for example, a property will be disociated from existing tenant)
                        fieldsConfigs.push(
                            `${field.name}: {
                                create: { ${getFieldConfigSearch(parent)}}
                            }
                           `
                        );
                        topRefs.push(
                            `${field.name}: z.object({
                                create: ${ref.name}CreateScalarSchema.extend({
                                    ${
                                        (polymorphRefAttribute?.args[0].value as ReferenceExpr).target.ref?.name
                                    }: z.enum(['${dataModel.name}']).default('${dataModel.name}'),
                                    ${parent.name}: z.object({ 
                                        connect: z.array(z.object({ id: z.string() }))
                                    })
                                })`
                        );
                    }
                } else {
                    fieldsConfigs.push(getFieldConfigSearch(field));
                    if (field.type.array) {
                        lowRefs.push(
                            `${field?.name}: z.object({connect: z.array(z.object({ id: z.string() }))).optional()`
                        );
                    } else {
                        topRefs.push(`${field.name}: z.string()${field.type.optional ? `.optional()` : ''}`);
                    }
                }
            }
        });

        // + eslint disable
        sf.addStatements(`import { FieldConfigItem } from '@/components/ui/auto-form/types'`);
        sf.addStatements(`import { z, AnyZodObject } from 'zod'`);
        const scalarSchemaName = `${dataModel.name}CreateScalarSchema`;
        sf.addStatements(
            `import { ${[scalarSchemaName].concat(
                polymorphModels.map((refName) => `${refName}CreateScalarSchema`)
            )} } from '@zenstackhq/runtime/zod/models'`
        );

        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}FormConfig`,
                    initializer: `z.object({ ${topRefs.join(
                        ','
                    )} }).extend(${scalarSchemaName}.shape).extend({ ${lowRefs.join(',')} })`,
                },
            ],
        });
        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}FieldConfig`,
                    initializer: `{${fieldsConfigs.join(',')}}`,
                },
            ],
        });

        return `${dataModel.name}`;
    });*/

    const sf = project.createSourceFile(path.join(outDir, `typeHooks.tsx`), undefined, { overwrite: true });
    const names = models.map((dataModel) => dataModel.name);

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
    sf.addStatements(`import { ${hooks.join(',')} } from '@/zmodel/lib/hooks';`);

    /*names.forEach((name) => {
        sf.addStatements(
            `import { ${name}FormConfig, ${name}FieldConfig } from '@/zmodel/lib/forms/${paramCase(name)}';`
        );
    });*/

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
            },
        ],
    });
    await saveProject(project);

    return { warnings };
}
