import { Prisma } from '@prisma/client';
import { AutoFormDialog } from '@/components/Form/CreateForm';
import { getTypeHook } from '../Table/getTypeHook';
import { toast } from 'react-toastify';

export const GridCardFooterButtonInclude = true;

export function GridCardFooterButton({
    button,
}: {
    button: Prisma.GridCardFooterButtonGetPayload<typeof GridCardFooterButtonInclude>;
}) {
    const typeHook = getTypeHook({ type: button.table });

    const create = typeHook.useCreate.single();

    return (
        <AutoFormDialog
            formSchema={typeHook.schema.create}
            onSubmitData={async (data) => {
                // @ts-ignore
                await create.mutateAsync({ data });
                toast.success(`${button.table} created successfully!`);
            }}
            title={button.text}
        />
    );
}
