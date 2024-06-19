import { CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Prisma } from '@prisma/client';
import { GridCardFooterButton, GridCardFooterButtonInclude } from './GridCardFooterButton';

export const GridCardFooterInclude = {
    include: {
        button: GridCardFooterButtonInclude,
        progress: true,
    },
};

export function GridCardFooter({ footer }: { footer: Prisma.GridCardFooterGetPayload<typeof GridCardFooterInclude> }) {
    return (
        <CardFooter>
            {footer.button && <GridCardFooterButton button={footer.button} />}
            {footer.progress && <Progress value={footer.progress?.value} />}
        </CardFooter>
    );
}
