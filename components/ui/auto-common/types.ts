import { ZodObjectOrWrapped } from '../auto-form/utils';
import { z } from 'zod';

export type CommonFormTable<SchemaType extends ZodObjectOrWrapped> = {
    formSchema: SchemaType;
    values?: Partial<z.infer<SchemaType>>;
};
