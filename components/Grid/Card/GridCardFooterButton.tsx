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
            onSubmitData={async (data: Record<string, any>) => {
                Object.entries(typeHook.form.fieldConfig).forEach(([key, config]) => {
                    if (data[key] && typeof data[key] === 'string' && config.search?.enableMultiRowSelection) {
                        data[key] = {
                            connect: (data[key] as string).split(',').map((id) => ({ id })),
                        };
                    }
                });
                // @ts-ignore
                await create.mutateAsync({ data });
                toast.success(`${button.table} created successfully!`);
            }}
            title={button.text}
        />
    );
}
