import { useCreateTable, useFindManyTable, useFindUniqueSpace } from '@/zmodel/lib/hooks';
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

export function SpaceHomeComponent({
    tables,
}: {
    tables: {
        owner: User;
        dashboard: Dashboard | null;
        list: List | null;
        property: Property | null;
    }[];
}) {
    const createTable = useCreateTable();
    const router = useRouter();
    return (
        <WithNavBar>
            <div className="p-8">
                <div className="mb-8 flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <CreateForm
                        formSchema={z.object({ list: ListCreateScalarSchema })}
                        onSubmitData={async (data) => {
                            await createTable.mutateAsync({
                                data: {
                                    type: 'List',
                                    list: {
                                        create: data.list,
                                    },
                                },
                            });
                        }}
                        title={'Create List'}
                    />
                    <CreateForm
                        formSchema={z.object({
                            property: PropertyCreateScalarSchema,
                        })}
                        onSubmitData={async (data) => {
                            await createTable.mutateAsync({
                                data: {
                                    type: Type.Property,
                                    property: {
                                        create: data.property,
                                    },
                                },
                            });
                        }}
                        title={'Create Property'}
                    />
                    <CreateForm
                        formSchema={z.object({ dashboard: DashboardCreateScalarSchema })}
                        onSubmitData={async (data) => {
                            await createTable.mutateAsync({
                                data: {
                                    type: 'Dashboard',
                                    dashboard: {
                                        create: data.dashboard,
                                    },
                                },
                            });
                        }}
                        title={'Create Dashboard'}
                    />
                </div>

                <h2 className="mb-4 text-xl font-semibold">Components</h2>
                <ul className="mb-8 flex flex-wrap gap-6">
                    {tables.map((table) => {
                        if (table.dashboard) {
                            return (
                                <li key={table.dashboard.id}>
                                    <Link href={`${router.asPath}/dashboard/${table.dashboard.id}`}>
                                        <SpaceComponentCard spaceComponent={table.dashboard}>
                                            {table.dashboard.createdAt.toString()}
                                        </SpaceComponentCard>
                                    </Link>
                                </li>
                            );
                        } else if (table.list) {
                            return (
                                <li key={table.list.id}>
                                    <Link href={`${router.asPath}/list/${table.list.id}`}>
                                        <SpaceComponentCard spaceComponent={table.list}>
                                            <ListCard list={table.list} />
                                        </SpaceComponentCard>
                                    </Link>
                                </li>
                            );
                        } else if (table.property) {
                            return (
                                <li key={table.property.id}>
                                    <Link href={`${router.asPath}/property/${table.property.id}`}>
                                        <SpaceComponentCard spaceComponent={table.property}>
                                            <PropertyCard property={table.property} />
                                        </SpaceComponentCard>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </WithNavBar>
    );
}
