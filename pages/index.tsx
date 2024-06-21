import type { NextPage } from 'next';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { useFindManyProperty } from '@/zmodel/lib/hooks';
import { PropertyScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';
import { Type } from '@prisma/client';

export const Home: NextPage = () => {
    return (
        <WithNavBar>
            <SpaceHomeComponent />
        </WithNavBar>
    );
};

export default Home;
