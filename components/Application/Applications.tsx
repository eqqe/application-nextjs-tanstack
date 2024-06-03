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
import { Space } from '@zenstackhq/runtime/models';
import { useQueryClient } from '@tanstack/react-query';

export const Applications = ({ space }: { space: Space }) => {
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
        where: { spaceId: space?.id },
        include: {
            applicationVersion: {
                include: {
                    application: true,
                },
            },
        },
    });

    const queryClient = useQueryClient();
    if (!applications || !space) {
        return <>Loading...</>;
    }
    const applicationsData = applications.map((application) => {
        const activated = spaceApplications?.find(
            (spaceApplication) => spaceApplication.applicationVersion.applicationSlug === application.slug
        );
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
        async function onClickActivate() {
            if (activated) {
                await desactivate.mutateAsync({ where: { id: activated.id } });
            } else if (application.versions.length) {
                await activate.mutateAsync({
                    data: { applicationVersionId: application.versions[0].id, spaceId: space.id },
                });
            } else {
                toast('No version available for this application');
            }
            queryClient.refetchQueries({ queryKey: ['zenstack', 'Grid'] });
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

        return (
            <div key={application.id}>
                <Button onClick={onClickActivate} variant={activated ? 'default' : 'outline'} className="min-w-40">
                    {activated ? 'Disable' : 'Enable'} {application.slug}
                </Button>
                {updatable.major && (
                    <Button onClick={onClickUpdateMajor} className="min-w-40">
                        Major update
                    </Button>
                )}
                {updatable.minor && (
                    <Button onClick={onClickUpdateMinor} className="min-w-40">
                        Minor update
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
