import type { NextPage } from 'next';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';
import { WithNavBar } from '@/components/layout/WithNavBar';

export const Home: NextPage = () => {
    return (
        <WithNavBar>
            <SpaceHomeComponent />
        </WithNavBar>
    );
};

export default Home;
