import {
    useCreateSpaceApplicationVersion,
    useDeleteSpaceApplicationVersion,
    useFindManyApplication,
    useFindManySpaceApplicationVersion,
    useUpdateSpaceApplicationVersion,
} from '@/zmodel/lib/hooks';
import { Button } from '@/components/ui/button';
import {
    ApplicationVersionScalarSchema,
    SpaceApplicationVersionScalarSchema,
    SpaceScalarSchema,
    ApplicationScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { AutoTable } from '../ui/auto-table';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { ApplicationVersion } from '@zenstackhq/runtime/models';

export const Applications = () => {
    const { data: applications } = useFindManyApplication({
        include: {
            versions: {
                include: {
                    activations: {
                        include: {
                            space: true,
                        },
                    },
                },
                orderBy: [
                    {
                        versionMajor: 'desc',
                    },
                    {
                        versionMinor: 'desc',
                    },
                ],
            },
        },
    });

    const activate = useCreateSpaceApplicationVersion();
    const desactivate = useDeleteSpaceApplicationVersion();
    const update = useUpdateSpaceApplicationVersion();
    const { data: spaceApplications } = useFindManySpaceApplicationVersion({
        include: {
            applicationVersion: {
                include: {
                    application: true,
                },
            },
        },
    });

    const queryClient = useQueryClient();
    if (!applications) {
        return <>Loading...</>;
    }
    const applicationsData = applications.map((application) => {
        const activated = spaceApplications?.find(
            (spaceApplication) => spaceApplication.applicationVersion.applicationSlug === application.slug
        );
        /* Application are ordered by descending version, so the latest version should be found */
        const updatable = {
            major: activated
                ? application.versions.find(
                      (version) => version.versionMajor > (activated.applicationVersion.versionMajor ?? 0)
                  )
                : null,
            minor: activated
                ? application.versions.find(
                      (version) =>
                          version.versionMinor > (activated.applicationVersion.versionMinor ?? 0) &&
                          version.versionMajor === activated.applicationVersion.versionMajor
                  )
                : null,
        };

        /* Application are ordered by descending version, so the closest previous version should be found */
        const rollbackable = {
            major: activated
                ? application.versions.find(
                      (version) => version.versionMajor < (activated.applicationVersion.versionMajor ?? 0)
                  )
                : null,
            minor: activated
                ? application.versions.find(
                      (version) =>
                          version.versionMinor < (activated.applicationVersion.versionMinor ?? 0) &&
                          version.versionMajor === activated.applicationVersion.versionMajor
                  )
                : null,
        };
        async function refetchGrids() {
            queryClient.refetchQueries({ queryKey: ['zenstack', 'Grid'] });
        }
        async function onClickActivate() {
            if (activated) {
                await desactivate.mutateAsync({ where: { id: activated.id } });
            } else if (application.versions.length) {
                await activate.mutateAsync({
                    data: { applicationVersionId: application.versions[0].id },
                });
            } else {
                toast('No version available for this application');
            }
            refetchGrids();
        }

        async function updateToVersion(applicationVersionId: string) {
            if (!activated) {
                return;
            }
            await update.mutateAsync({
                data: {
                    applicationVersionId,
                },
                where: {
                    id: activated.id,
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

        function displayVersion({ version }: { version: ApplicationVersion }) {
            return `version ${version.versionMajor}.${version.versionMinor}`;
        }
        return (
            <div key={application.id} className="flex gap-5">
                <Button onClick={onClickActivate} variant={activated ? 'default' : 'outline'} className="min-w-40">
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
    });
    return (
        <>
            {applicationsData}
            <AutoTable
                formSchema={ApplicationScalarSchema.extend({
                    versions: z.array(
                        ApplicationVersionScalarSchema.extend({
                            activations: z.array(
                                SpaceApplicationVersionScalarSchema.extend({ space: SpaceScalarSchema })
                            ),
                        })
                    ),
                })}
                data={applications}
            />
        </>
    );
};
