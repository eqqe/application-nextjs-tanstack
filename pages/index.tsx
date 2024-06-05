import { useFindManyDashboard, useFindManyProperty, useFindManyList } from '@/zmodel/lib/hooks';
import type { NextPage } from 'next';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';

export const Home: NextPage = () => {
    return <SpaceHomeComponent />;
};

export default Home;
