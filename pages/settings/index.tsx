import { Applications } from '@/components/Application/Applications';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { useFindManySpace } from '@/zmodel/lib/hooks';
import type { NextPage } from 'next';
import { useCurrentSpace } from '@/lib/context';
import { GenerateDemonstration } from '@/components/Space/GenerateDemonstration';
import { SpaceMembers } from '@/components/Space/SpaceMembers';

export const Settings: NextPage = () => {
    const { data: spaces } = useFindManySpace();
    const currentSpace = useCurrentSpace();

    if (!spaces) {
        return <WithNavBar>Loading</WithNavBar>;
    }

    return (
        <WithNavBar>
            <Tabs defaultValue={currentSpace?.id ?? spaces[0].id}>
                <TabsList className="grid w-full grid-cols-2">
                    {spaces.map((space) => (
                        <TabsTrigger key={space.id} value={space.id}>
                            {space.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {spaces.map((space) => (
                    <TabsContent key={space.id} value={space.id}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{space.name}</CardTitle>
                                <CardDescription>Applications for {space.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <GenerateDemonstration />
                                <SpaceMembers />
                                <Applications space={space} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </WithNavBar>
    );
};

export default Settings;
