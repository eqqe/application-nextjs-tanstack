import { useFindManyTable } from '@/zmodel/lib/hooks';
import type { NextPage } from 'next';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';

export const Home: NextPage = () => {
    const { data: tables } = useFindManyTable({
        include: {
            owner: true,
            dashboard: true,
            list: true,
            property: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    if (!tables) {
        return <></>;
    }
    return <SpaceHomeComponent tables={tables} />;
};

export default Home;
