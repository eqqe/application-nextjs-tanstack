import {
    useCreateManyCharge,
    useCreateManyDashboard,
    useCreateManyLease,
    useCreateManyList,
    useCreateManyPayment,
    useCreateManyProperty,
} from '@/zmodel/lib/hooks';
import { generateData } from '@/lib/fake';

export const GenerateDemonstration = () => {
    const createManyProperty = useCreateManyProperty();
    const createManyDashboard = useCreateManyDashboard();
    const createManyList = useCreateManyList();

    const createManyLease = useCreateManyLease();
    const createManyPayment = useCreateManyPayment();
    const createManyCharge = useCreateManyCharge();

    const generateDemonstration = async ({ length }: { length: number }) => {
        const { dashboards, lists, properties, leases, payments, charges } = generateData({ length });

        await createManyDashboard.mutateAsync({ data: dashboards });
        await createManyList.mutateAsync({ data: lists });
        await createManyProperty.mutateAsync({ data: properties });
        await createManyLease.mutateAsync({ data: leases });
        await createManyPayment.mutateAsync({ data: payments });
        await createManyCharge.mutateAsync({ data: charges });
    };

    return <button onClick={() => generateDemonstration({ length: 15 })}>Generate Demonstration</button>;
};
