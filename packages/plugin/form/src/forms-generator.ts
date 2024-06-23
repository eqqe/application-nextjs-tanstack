import { isDataModel, type DataModel, type Model, DataModelFieldType } from '@zenstackhq/sdk/ast';
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
    resolvePath,
    saveProject,
    ZModelCodeGenerator,
} from '@zenstackhq/sdk';
import path from 'path';
import { paramCase } from 'change-case';
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

        const fields = dataModel.fields.flatMap((field) => {
            if (field.name === 'ownerId') {
                return [];
            }
            const ref = field.type.reference?.ref;
            if (ref?.$type === 'DataModel') {
                return [`${field.name} ${ref.name} ${JSON.stringify(ref.attributes)}`];
            }
            return [];
        });

        sf.addStatements('/* eslint-disable */');
        sf.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `${dataModel.name}FormSchema`,
                    initializer: fields.join(','),
                },
            ],
        });

        return `${dataModel.name}`;
    });

    await saveProject(project);

    return { warnings };
}
