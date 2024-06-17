import { Applications } from '@/components/Application/Applications';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import type { NextPage } from 'next';
import { GenerateDemonstration } from '@/components/Space/GenerateDemonstration';
import { SpaceMembers } from '@/components/Space/SpaceMembers';
import { useCurrentSpace } from '@/lib/context';

export const Settings: NextPage = () => {
    const currentSpace = useCurrentSpace();

    return (
        <WithNavBar>
            <Card>
                <CardHeader>
                    <CardTitle>{currentSpace?.name}</CardTitle>
                    <CardDescription>Applications for {currentSpace?.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <GenerateDemonstration />
                    <SpaceMembers />
                    <Applications />
                </CardContent>
            </Card>
        </WithNavBar>
    );
};

export default Settings;
