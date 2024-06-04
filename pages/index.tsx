import { useFindManyDashboard, useFindManyProperty, useFindManyList } from '@/zmodel/lib/hooks';
import type { NextPage } from 'next';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';

export const Home: NextPage = () => {
    const { data: dashboards } = useFindManyDashboard({
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
    const { data: properties } = useFindManyProperty({
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
    const { data: lists } = useFindManyList({
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
    if (!dashboards || !properties || !lists) {
        return <></>;
    }
    return <SpaceHomeComponent lists={lists} properties={properties} dashboards={dashboards} />;
};

export default Home;
