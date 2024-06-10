import { PropertyCard } from '@/components/Property/PropertyCard';
import { SpaceComponentCard } from '@/components/Dashboard/DashboardCard';
import { CreateForm } from 'components/Form/CreateForm';
import {
    PropertyCreateScalarSchema,
    ListCreateScalarSchema,
    DashboardCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { ListCard } from '@/components/List/ListCard';
import Link from 'next/link';
import {
    useCreateDashboard,
    useCreateList,
    useCreateProperty,
    useFindManyDashboard,
    useFindManyList,
    useFindManyProperty,
} from '@/zmodel/lib/hooks';
import { toast } from 'react-toastify';

export function SpaceHomeComponent() {
    const createList = useCreateList();
    const createProperty = useCreateProperty();
    const createDashboard = useCreateDashboard();
    const { data: dashboards } = useFindManyDashboard({
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
    return (
        <WithNavBar>
            <div className="p-8">
                <div className="mb-8 flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <CreateForm
                        formSchema={z.object({ list: ListCreateScalarSchema })}
                        onSubmitData={async (data) => {
                            await createList.mutateAsync({
                                data: data.list,
                            });
                            toast.success(`${data.list.name} created successfully!`);
                        }}
                        title={'Create List'}
                    />
                    <CreateForm
                        formSchema={z.object({ dashboard: DashboardCreateScalarSchema })}
                        onSubmitData={async (data) => {
                            await createDashboard.mutateAsync({
                                data: data.dashboard,
                            });
                            toast.success(`${data.dashboard.name} created successfully!`);
                        }}
                        title={'Create Dashboard'}
                    />
                </div>

                <h2 className="mb-4 text-xl font-semibold">Components</h2>
                <ul className="mb-8 flex flex-wrap gap-6">
                    {dashboards?.map((dashboard) => {
                        return (
                            <li key={dashboard.id}>
                                <Link href={`/dashboard/${dashboard.id}`}>
                                    <SpaceComponentCard spaceComponent={dashboard}>
                                        {dashboard.createdAt.toString()}
                                    </SpaceComponentCard>
                                </Link>
                            </li>
                        );
                    })}

                    {lists?.map((list) => {
                        return (
                            <li key={list.id}>
                                <Link href={`/list/${list.id}`}>
                                    <SpaceComponentCard spaceComponent={list}>
                                        <ListCard list={list} />
                                    </SpaceComponentCard>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </WithNavBar>
    );
}
