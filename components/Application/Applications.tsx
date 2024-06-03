import { useCurrentSpace } from '@/lib/context';
import {
    useCreateSpaceApplicationVersion,
    useDeleteSpaceApplicationVersion,
    useFindManyApplication,
    useFindManySpaceApplicationVersion,
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
                },
            },
        },
        {
            enabled: !!space,
        }
    );

    const activate = useCreateSpaceApplicationVersion();
    const desactivate = useDeleteSpaceApplicationVersion();
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
            (spaceApplication) => spaceApplication.applicationVersion.applicationId === application.id
        );
        const onClick = () => {
            if (activated) {
                return desactivate.mutateAsync({ where: { id: activated.id } });
            } else if (application.versions.length) {
                return activate.mutateAsync({
                    data: { applicationVersionId: application.versions[0].id, spaceId: space.id },
                });
            }
            toast('No version available for this application');
        };
        return (
            <div key={application.id}>
                {
                    <Button onClick={onClick} variant={activated ? 'default' : 'outline'}>
                        {activated ? 'Disable' : 'Enable'} {application.slug}
                    </Button>
                }
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
