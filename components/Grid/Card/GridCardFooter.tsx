import { CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Prisma } from '@prisma/client';
import { GridCardFooterButton, GridCardFooterButtonInclude } from './GridCardFooterButton';
import Link from 'next/link';

export const GridCardFooterInclude = {
    include: {
        button: GridCardFooterButtonInclude,
        progress: true,
        form: true,
    },
};

export function GridCardFooter({ footer }: { footer: Prisma.GridCardFooterGetPayload<typeof GridCardFooterInclude> }) {
    return (
        <CardFooter>
            {footer.button && <GridCardFooterButton button={footer.button} />}
            {footer.progress && <Progress value={footer.progress?.value} />}
            {footer.form && <Link href="#">{footer.form.text}</Link>}
        </CardFooter>
    );
}
