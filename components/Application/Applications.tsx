import { useFindManyApplication, useUpdateSpace } from '@/zmodel/lib/hooks';
import { Button } from '@/components/ui/button';
import { ApplicationScalarSchema, ApplicationVersionScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Prisma } from '@prisma/client';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { useCurrentSpace } from '@/lib/context';

export const findManyApplicationArgs = {
    include: {
        versions: {
            include: {
                activations: true,
            },
            orderBy: [
                {
                    versionMajor: Prisma.SortOrder.desc,
                },
                {
                    versionMinor: Prisma.SortOrder.desc,
                },
            ],
        },
    },
};
export const Applications = () => {
    const { data: applications } = useFindManyApplication(findManyApplicationArgs);

    const updateSpace = useUpdateSpace();

    const space = useCurrentSpace();

    const queryClient = useQueryClient();
    if (!applications || !space) {
        return <>Loading...</>;
    }

    const schema = ApplicationScalarSchema.extend({
        versions: z.array(ApplicationVersionScalarSchema),
    });

    type ColumnDefFromSchema = ColumnDef<z.infer<typeof schema>>[];
    const additionalColumns: ColumnDefFromSchema = [
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const application = row.original;
                const activated = space?.applications.find(
                    (spaceApplication) => spaceApplication.applicationSlug === application.slug
                );
                /* Application are ordered by descending version, so the latest version should be found */
                const updatable = {
                    major: activated
                        ? application.versions.find((version) => version.versionMajor > (activated.versionMajor ?? 0))
                        : null,
                    minor: activated
                        ? application.versions.find(
                              (version) =>
                                  version.versionMinor > (activated.versionMinor ?? 0) &&
                                  version.versionMajor === activated.versionMajor
                          )
                        : null,
                };

                /* Application are ordered by descending version, so the closest previous version should be found */
                const rollbackable = {
                    major: activated
                        ? application.versions.find((version) => version.versionMajor < (activated.versionMajor ?? 0))
                        : null,
                    minor: activated
                        ? application.versions.find(
                              (version) =>
                                  version.versionMinor < (activated.versionMinor ?? 0) &&
                                  version.versionMajor === activated.versionMajor
                          )
                        : null,
                };
                async function refetchGrids() {
                    await queryClient.refetchQueries({ queryKey: ['zenstack', 'SubTabFolder'] });
                }
                async function onClickActivate() {
                    if (!space) {
                        return;
                    }
                    if (activated && space) {
                        await updateSpace.mutateAsync({
                            where: { id: space.id },
                            data: {
                                applications: {
                                    disconnect: {
                                        id: activated.id,
                                    },
                                },
                            },
                        });
                    } else if (application.versions.length) {
                        await updateSpace.mutateAsync({
                            where: { id: space.id },
                            data: {
                                applications: {
                                    connect: {
                                        id: application.versions[0].id,
                                    },
                                },
                            },
                        });
                    } else {
                        toast('No version available for this application');
                    }
                    refetchGrids();
                }

                async function updateToVersion(applicationVersionId: string) {
                    if (!activated || !space) {
                        return;
                    }
                    await updateSpace.mutateAsync({
                        where: { id: space.id },
                        data: {
                            applications: {
                                update: {
                                    where: {
                                        id: activated.id,
                                    },
                                    data: {
                                        id: applicationVersionId,
                                    },
                                },
                            },
                        },
                    });
                    refetchGrids();
                }

                async function onClickUpdateMajor() {
                    if (!updatable.major) {
                        return;
                    }
                    await updateToVersion(updatable.major.id);
                }
                async function onClickUpdateMinor() {
                    if (!updatable.minor) {
                        return;
                    }
                    await updateToVersion(updatable.minor.id);
                }

                async function onClickRollbackMajor() {
                    if (!rollbackable.major) {
                        return;
                    }
                    await updateToVersion(rollbackable.major.id);
                }
                async function onClickRollbackMinor() {
                    if (!rollbackable.minor) {
                        return;
                    }
                    await updateToVersion(rollbackable.minor.id);
                }

                function displayVersion({ version }: { version: z.infer<typeof ApplicationVersionScalarSchema> }) {
                    return `version ${version.versionMajor}.${version.versionMinor}`;
                }

                return (
                    <div key={application.id} className="flex gap-5">
                        <Button
                            onClick={onClickActivate}
                            variant={activated ? 'default' : 'outline'}
                            className="min-w-40"
                        >
                            {activated ? 'Disable' : 'Enable'} {application.slug}
                        </Button>
                        {updatable.major && (
                            <Button onClick={onClickUpdateMajor} className="min-w-40">
                                Update to {displayVersion({ version: updatable.major })}
                            </Button>
                        )}
                        {updatable.minor && (
                            <Button onClick={onClickUpdateMinor} className="min-w-40">
                                Update to {displayVersion({ version: updatable.minor })}
                            </Button>
                        )}
                        {rollbackable.major && (
                            <Button onClick={onClickRollbackMajor} className="min-w-40">
                                Rollback to {displayVersion({ version: rollbackable.major })}
                            </Button>
                        )}
                        {rollbackable.minor && (
                            <Button onClick={onClickRollbackMinor} className="min-w-40">
                                Rollback to {displayVersion({ version: rollbackable.minor })}
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <AutoTable
            additionalColumns={additionalColumns}
            data={applications}
            onlyAdditionalColumns={false}
            formSchema={schema}
        />
    );
};
