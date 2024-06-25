import { DataModel, isDataModel, DataModelField } from '@zenstackhq/sdk/ast';
import { getAttribute } from '@zenstackhq/sdk';
import { getAttributeArgLiteral } from '@zenstackhq/sdk';
import { camelCase } from 'change-case';
import { Dependency } from './forms-generator';

function getBackLink(field: DataModelField) {
    if (!field.type.reference?.ref || !isDataModel(field.type.reference?.ref)) {
        return undefined;
    }

    const relName = getRelationName(field);

    const sourceModel = field.$container as DataModel;
    const targetModel = field.type.reference.ref as DataModel;

    for (const otherField of targetModel.fields) {
        if (otherField.type.reference?.ref === sourceModel) {
            if (relName) {
                const otherRelName = getRelationName(otherField);
                if (relName === otherRelName) {
                    return otherField;
                }
            } else {
                return otherField;
            }
        }
    }
    return undefined;
}

function getRelationName(field: DataModelField) {
    const relAttr = getAttribute(field, '@relation');
    if (!relAttr) {
        return undefined;
    }
    return getAttributeArgLiteral(relAttr, 'name');
}

export function buildDependency(field: DataModelField): Dependency {
    const minLenghtArray1 = !!getAttribute(field, '@form.minLenghtArray1');

    const key = field.name;
    const backLink = getBackLink(field);

    if (!backLink) {
        throw '!backlink';
    }

    const where = backLink.type.array
        ? {}
        : {
              [backLink.name]: null,
          };

    let type = field.type.reference?.ref?.name;
    if (!type) {
        throw '!parentType';
    }
    type = camelCase(type);

    return {
        minLenghtArray1,
        key,
        where,
        array: field.type.array,
        mode: 'connect',
        optional: field.type.optional,
        type,
    };
}
