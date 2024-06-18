import { useComponentIdRouter } from '@/lib/context';
import { useFindUniqueProperty } from '@/zmodel/lib/hooks';

export function useCurrentProperty() {
    const componentId = useComponentIdRouter();

    const { data: property } = useFindUniqueProperty(
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
