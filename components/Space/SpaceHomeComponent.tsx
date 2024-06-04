import { PropertyCard } from '@/components/SpaceComponent/Property/PropertyCard';
import { SpaceComponentCard } from '@/components/SpaceComponent/Dashboard/DashboardCard';
import { useRouter } from 'next/router';
import { CreateForm } from 'components/Form/CreateForm';
import { Property, List, Dashboard, Space, User, Type } from '@prisma/client';
import {
    PropertyCreateScalarSchema,
    ListCreateScalarSchema,
    DashboardCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';
import { WithNavBar } from '@/components/layout/WithNavBar';
import { ListCard } from '@/components/SpaceComponent/List/ListCard';
import Link from 'next/link';
import { useCreateDashboard, useCreateList, useCreateProperty } from '@/zmodel/lib/hooks';

export function SpaceHomeComponent({
    dashboards,
    lists,
    properties,
}: {
    dashboards: Dashboard[];
    lists: List[];
    properties: Property[];
}) {
    const router = useRouter();
    const createList = useCreateList();
    const createProperty = useCreateProperty();
    const createDashboard = useCreateDashboard();
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
                        }}
                        title={'Create List'}
                    />
                    <CreateForm
                        formSchema={z.object({
                            property: PropertyCreateScalarSchema,
                        })}
                        onSubmitData={async (data) => {
                            await createProperty.mutateAsync({
                                data: data.property,
                            });
                        }}
                        title={'Create Property'}
                    />
                    <CreateForm
                        formSchema={z.object({ dashboard: DashboardCreateScalarSchema })}
                        onSubmitData={async (data) => {
                            await createDashboard.mutateAsync({
                                data: data.dashboard,
                            });
                        }}
                        title={'Create Dashboard'}
                    />
                </div>

                <h2 className="mb-4 text-xl font-semibold">Components</h2>
                <ul className="mb-8 flex flex-wrap gap-6">
                    {dashboards.map((dashboard) => {
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

                    {lists.map((list) => {
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

                    {properties.map((property) => {
                        return (
                            <li key={property.id}>
                                <Link href={`/property/${property.id}`}>
                                    <SpaceComponentCard spaceComponent={property}>
                                        <PropertyCard property={property} />
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
