import { Type } from '@zenstackhq/runtime/models';

type BaseRelation = {
    referenceName: Type;
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
    type: Type;
};
