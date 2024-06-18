import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CardTableComponent, GridCardTableInclude } from '../Table/CardTableComponent';
import { paddingBottoms, textXl } from '../utils';
import { Prisma } from '@prisma/client';
import { GridCardFooterInclude, GridCardFooter } from '@/components/Grid/Card/GridCardFooter';
import { FallbackError } from '@/components/layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';

export const GridCardInclude = {
    include: {
        table: GridCardTableInclude,
        footer: GridCardFooterInclude,
    },
};

export function GridCard({ card }: { card: Prisma.GridCardGetPayload<typeof GridCardInclude> }) {
    const title = <CardTitle className={card.titleXl ? textXl[card.titleXl] : ''}>{card.title}</CardTitle>;
    const description = (
        <CardDescription className="max-w-lg text-balance leading-relaxed">{card.description}</CardDescription>
    );
    return (
        <Card key={card.id}>
            <ErrorBoundary fallback={<FallbackError />}>
                <CardHeader className={paddingBottoms[card.headerPb]}>
                    {card.invertTitleDescription ? (
                        <>
                            {description}
                            {title}
                        </>
                    ) : (
                        <>
                            {title}
                            {description}
                        </>
                    )}
                </CardHeader>
            </ErrorBoundary>
            <CardContent>
                <ErrorBoundary fallback={<FallbackError />}>
                    {card.content && <div className="text-muted-foreground text-xs">{card.content}</div>}
                </ErrorBoundary>
                <ErrorBoundary fallback={<FallbackError />}>
                    {card.table && <CardTableComponent table={card.table} />}
                </ErrorBoundary>
            </CardContent>
            <ErrorBoundary fallback={<FallbackError />}>
                {card.footer && <GridCardFooter footer={card.footer} />}
            </ErrorBoundary>
        </Card>
    );
}
