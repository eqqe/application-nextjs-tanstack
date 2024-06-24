import { Type } from '@zenstackhq/runtime/models';

type BaseDependency = {
    key: string;
    type: Type;
};
export type Dependency = BaseDependency & {
    array: boolean;
    optional: boolean;
    minLenghtArray1: boolean;
    mode: 'connect' | 'create';
    where: Record<string, any>;
};

type Polymorphism = BaseDependency & {
    parent: Dependency;
    storeTypeField: string;
};

export type FormDefinition = {
    mode: 'create' | 'update' | 'view';
    polymorphisms: Polymorphism[];
    parents: Dependency[];
    type: Type;
    children: Dependency[];
};
