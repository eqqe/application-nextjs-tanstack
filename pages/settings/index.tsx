import { Applications } from '@/components/Application/Applications';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import type { NextPage } from 'next';
import { GenerateDemonstration } from '@/components/Space/GenerateDemonstration';
import { useCurrentSpace } from '@/lib/context';
import { useI18n, useScopedI18n } from '@/locales';

export const Settings: NextPage = () => {
    const currentSpace = useCurrentSpace();
    const scopedT = useScopedI18n('settings');
    return (
        <WithNavBar>
            <Card>
                <CardHeader>
                    <CardTitle>{currentSpace?.name}</CardTitle>
                    <CardDescription>
                        {scopedT('applications.description', { spaceName: currentSpace?.name })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <GenerateDemonstration />
                    <Applications />
                </CardContent>
            </Card>
        </WithNavBar>
    );
};

export default Settings;
