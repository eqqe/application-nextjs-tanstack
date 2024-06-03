import { useCurrentSpace } from '@/lib/context';
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

export const Applications = () => {
    const space = useCurrentSpace();
    const { data: applications } = useFindManyApplication(
        {
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
        },
        {
            enabled: !!space,
        }
    );

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
        const onClickActivate = () => {
            if (activated) {
                return desactivate.mutateAsync({ where: { id: activated.id } });
            } else if (application.versions.length) {
                return activate.mutateAsync({
                    data: { applicationVersionId: application.versions[0].id, spaceId: space.id },
                });
            }
            toast('No version available for this application');
        };

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
                <Button onClick={onClickActivate} variant={activated ? 'default' : 'outline'}>
                    {activated ? 'Disable' : 'Enable'} {application.slug}
                </Button>
                <Button onClick={onClickUpdateMajor} variant={updatable.major ? 'default' : 'outline'}>
                    Major update
                </Button>
                <Button onClick={onClickUpdateMinor} variant={updatable.minor ? 'default' : 'outline'}>
                    Minor update
                </Button>
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
