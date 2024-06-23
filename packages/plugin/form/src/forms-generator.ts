import { isDataModel, type DataModel, type Model, DataModelFieldType, isArrayExpr } from '@zenstackhq/sdk/ast';
import fs from 'fs';
import {
    PluginError,
    type PluginOptions,
    RUNTIME_PACKAGE,
    createProject,
    ensureEmptyDir,
    generateModelMeta,
    getDataModels,
    requireOption,
    isEnumFieldReference,
    resolvePath,
    saveProject,
    ZModelCodeGenerator,
} from '@zenstackhq/sdk';
import path from 'path';
import { paramCase, camelCase } from 'change-case';
import { getPrismaClientImportSpec, supportCreateMany, type DMMF } from '@zenstackhq/sdk/prisma';
import { VariableDeclarationKind } from 'ts-morph';

export const name = 'Form';

export default async function run(model: Model, options: PluginOptions, dmmf: DMMF.Document) {
    const project = createProject();
    let outDir = requireOption<string>(options, 'output', name);
    outDir = resolvePath(outDir, options);
    ensureEmptyDir(outDir);
    const warnings: string[] = [];
    const models = getDataModels(model);

    models.map((dataModel) => {
        const fileName = paramCase(dataModel.name);
        const sf = project.createSourceFile(path.join(outDir, `${fileName}.ts`), undefined, { overwrite: true });

        const fieldsConfigs: string[] = [];
        const foreignKeys: string[] = [];
        const foreignArrays: string[] = [];
        dataModel.fields.forEach((field) => {
            if (field.name === 'owner' || field.name === 'space') {
                return;
            }
            const ref = field.type.reference?.ref;
            if (ref?.$type === 'DataModel') {
                fieldsConfigs.push(
                    `${field.name}: {
                    fieldType: 'search',
                    search: {
                        type: '${ref.name}',
                        enableMultiRowSelection: ${field.type.array},
                        optional: ${field.type.optional} 
                    },
                }`
                );

                const zodType = field.type.array || field.type.optional ? 'z.string().optional()' : 'z.string()';
                if (field.type.array) {
                    foreignArrays.push(`${field.name}: ${zodType}`);
                } else {
                    foreignKeys.push(`${field.name}: ${zodType}`);
                }
            }
            return;
        });

        sf.addStatements('/* eslint-disable */');
        sf.addStatements(`import { FieldConfigItem } from '@/components/ui/auto-form/types'`);
        sf.addStatements(`import { z, AnyZodObject } from 'zod'`);
        const scalarSchemaName = `${dataModel.name}CreateScalarSchema`;
        sf.addStatements(`import { ${scalarSchemaName} } from '@zenstackhq/runtime/zod/models'`);
        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}FormConfig`,
                    initializer: `z.object({ ${foreignKeys.join(
                        ','
                    )} }).extend(${scalarSchemaName}.shape).extend({ ${foreignArrays.join(',')} })`,
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
                    type: 'Record<string, FieldConfigItem>',
                },
            ],
        });

        return `${dataModel.name}`;
    });

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

    names.forEach((name) => {
        sf.addStatements(
            `import { ${name}FormConfig, ${name}FieldConfig } from '@/zmodel/lib/forms/${paramCase(name)}';`
        );
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
            formConfig: ${name}FormConfig,
            fieldConfig: ${name}FieldConfig
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
            },
        ],
    });
    await saveProject(project);

    return { warnings };
}
