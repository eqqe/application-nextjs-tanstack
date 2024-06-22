import { TabsContent } from '@/components/ui/tabs';
import { GridCard, GridCardInclude } from '../Card/GridCard';

import { Prisma } from '@prisma/client';
import { orderByCreatedAt } from '@/lib/utils';

export const GridTabContentInclude = {
    include: {
        elements: {
            include: {
                card: GridCardInclude,
            },
            ...orderByCreatedAt,
        },
    },
    ...orderByCreatedAt,
};
export function GridTabContent({
    tabContent,
}: {
    tabContent: Prisma.GridTabContentGetPayload<typeof GridTabContentInclude>;
}) {
    return (
        <TabsContent value={tabContent.name}>
            {tabContent.elements.map((element) => {
                switch (element.type) {
                    case 'Card':
                        return element.card ? <GridCard key={element.id} card={element.card} /> : <></>;
                    default:
                        return <></>;
                }
            })}
        </TabsContent>
    );
}
