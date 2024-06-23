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
        const extendedSchema: string[] = [];
        dataModel.fields.forEach((field) => {
            if (field.name === 'owner') {
                return;
            }
            const ref = field.type.reference?.ref;
            if (ref?.$type === 'DataModel') {
                const id = `${field.name}Id`;
                fieldsConfigs.push(
                    `${id}: {
                    fieldType: 'search',
                    search: {
                        type: '${ref.name}',
                        enableMultiRowSelection: ${field.type.array},
                        optional: ${field.type.optional} 
                    },
                }`
                );
                const zodType = field.type.array || field.type.optional ? 'z.string().optional()' : 'z.string()';
                extendedSchema.push(`${id}: ${zodType}`);
            }
            return;
        });

        sf.addStatements('/* eslint-disable */');
        sf.addStatements(`import { FieldConfigItem } from '@/components/ui/auto-form/types'`);
        sf.addStatements(`import { z, AnyZodObject } from 'zod'`);
        const scalarSchemaName = `${dataModel.name}ScalarSchema`;
        sf.addStatements(`import { ${scalarSchemaName} } from '@zenstackhq/runtime/zod/models'`);
        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}FormConfig`,
                    initializer: `{
                        fieldConfig: {${fieldsConfigs.join(',')}},
                        formSchema: z.object({ ${extendedSchema.join(',')} }).extend(${scalarSchemaName}.shape)
                    }`,
                    type: '{ fieldConfig: Record<string, FieldConfigItem>; formSchema: AnyZodObject }',
                },
            ],
        });

        return `${dataModel.name}`;
    });

    await saveProject(project);

    return { warnings };
}
