import { toast } from 'react-toastify';
import AutoForm from '@/components/ui/auto-form';
import { z } from 'zod';
import { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackError } from '@/components/layout/FallbackError';
import { CommonFormTable } from '@/components/ui/auto-common/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CreateForm<SchemaType extends ZodObjectOrWrapped>({
    onSubmitData,
    formSchema,
    values,
    title,
}: {
    onSubmitData: (data: z.infer<SchemaType>) => Promise<void>;
    title: string;
} & CommonFormTable<SchemaType>) {
    const [open, setOpen] = useState(false);
    const onSubmit = async (data: z.infer<SchemaType>) => {
        toast.dismiss();
        try {
            setOpen(false);
            await onSubmitData(data);
        } catch (err) {
            toast.error('Failed to create');
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <ScrollArea className="max-h-[80vh] pl-2 pr-6 pt-2">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{title}</DialogDescription>
                    </DialogHeader>
                    <ErrorBoundary fallback={<FallbackError />}>
                        <AutoForm formSchema={formSchema} values={values} onSubmit={onSubmit}>
                            <div className="modal-action">
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </div>
                        </AutoForm>
                    </ErrorBoundary>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
