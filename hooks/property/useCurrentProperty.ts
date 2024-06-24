import { useComponentIdRouter } from '@/lib/context';
import { trpc } from '@/lib/trpc';

export function useCurrentProperty() {
    const componentId = useComponentIdRouter();

    const { data: property } = trpc.property.findUnique.useQuery(
        {
            where: {
                id: componentId,
            },
            include: {
                leases: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        owner: true,
                    },
                },
            },
        },
        {
            enabled: !!componentId,
        }
    );
    return property;
}
