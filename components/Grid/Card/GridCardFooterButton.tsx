import { Prisma } from '@prisma/client';
import { AutoFormDialog } from '@/components/Form/AutoFormDialog';
import { toast } from 'react-toastify';
import { typeHooks } from '@/zmodel/lib/forms/typeHooks';

export const GridCardFooterButtonInclude = true;

export function GridCardFooterButton({
    button,
}: {
    button: Prisma.GridCardFooterButtonGetPayload<typeof GridCardFooterButtonInclude>;
}) {
    const typeHook = typeHooks[button.table];

    const create = typeHook.useCreate.single();

    return (
        <AutoFormDialog
            formSchema={typeHook.form.formConfig}
            fieldConfig={typeHook.form.fieldConfig}
            onSubmitData={async (data) => {
                try {
                    // @ts-ignore
                    await create.mutateAsync({ data });
                    toast.success(`${button.table} created successfully!`);
                } catch {
                    toast.error(`Error creating ${button.table}`);
                }
            }}
            title={button.text}
        />
    );
}
