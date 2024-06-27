import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GridTabContent, GridTabContentInclude } from './GridTabContent';
import { Prisma } from '@prisma/client';

export const GridTabsInclude = {
    include: {
        tabsContent: GridTabContentInclude,
    },
};

export function GridTabs({ tabs }: { tabs: Prisma.GridTabsGetPayload<typeof GridTabsInclude> }) {
    const tabsContent = tabs.tabsContent;
    if (!tabsContent.length) {
        throw 'Not tabsContent lenght';
    }
    return (
        <Tabs defaultValue={tabsContent[0].name} className="col-span-4 ">
            <div className="flex items-center  ">
                <TabsList className="overflow-x-auto">
                    {tabsContent.map((tabContent, key) => (
                        <TabsTrigger key={key} value={tabContent.name}>
                            {tabContent.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            {tabsContent.map((tabContent) => (
                <GridTabContent key={tabContent.id} tabContent={tabContent} />
            ))}
        </Tabs>
    );
}
