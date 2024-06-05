import { faker } from '@faker-js/faker';
import {
    useCreateManyCharge,
    useCreateManyDashboard,
    useCreateManyLease,
    useCreateManyList,
    useCreateManyPayment,
    useCreateManyProperty,
} from '@/zmodel/lib/hooks';
import { PropertyType, ChargeType } from '@prisma/client';

export const fakeProperty = (postalCode?: string) => {
    return {
        name: faker.word.noun(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        propertyType: PropertyType.COMMERCIAL,
        postalCode: postalCode ?? faker.location.zipCode(),
        country: faker.location.country(),
    };
};

export const fakeLease = (propertyId: string) => {
    return {
        propertyId,
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        rentAmount: faker.number.float({ min: 5, max: 50 }),
    };
};
export const fakePayment = (leaseId: string) => {
    return {
        leaseId,
        amount: faker.number.bigInt({ min: 500, max: 5000 }),
        date: faker.date.past(),
    };
};

const fakeCharge = ({ propertyId, leaseId }: { propertyId: string; leaseId: string }) => {
    return {
        propertyId,
        leaseId,
        chargeType: ChargeType.UTILITIES,
        amount: faker.number.bigInt({ min: 5, max: 100 }),
        dueDate: faker.date.future(),
        description: faker.lorem.sentence(),
    };
};

export const GenerateDemonstration = () => {
    const createManyProperty = useCreateManyProperty();
    const createManyDashboard = useCreateManyDashboard();
    const createManyList = useCreateManyList();

    const createManyLease = useCreateManyLease();
    const createManyPayment = useCreateManyPayment();
    const createManyCharge = useCreateManyCharge();

    const generateDemonstration = async () => {
        const prefix = `demo_${Date.now()}_`;

        await createManyDashboard.mutateAsync({
            data: Array.from({ length: 5 }).map((_, index) => ({
                name: `${prefix}Dashboard${index}`,
            })),
        });
        await createManyList.mutateAsync({
            data: Array.from({ length: 5 }).map((_, index) => ({
                name: `${prefix}List${index}`,
            })),
        });
        await createManyProperty.mutateAsync({
            data: Array.from({ length: 5 }).map((_, index) => ({
                ...fakeProperty(index === 0 ? 'Property to find in Playwright test' : void 0),
                id: `${prefix}Property${index}`,
                name: `${prefix}Property${index}`,
            })),
        });

        const propertyId = `${prefix}Property${0}`;
        await createManyLease.mutateAsync({
            data: Array.from({ length: 5 }).map((_, index) => ({
                ...fakeLease(propertyId),
                id: `${prefix}Lease${index}`,
            })),
        });

        const leaseId = `${prefix}Lease${0}`;
        await createManyPayment.mutateAsync({ data: Array.from({ length: 5 }, () => fakePayment(leaseId)) });
        await createManyCharge.mutateAsync({
            data: Array.from({ length: 5 }, () => fakeCharge({ propertyId, leaseId })),
        });
    };

    return <button onClick={generateDemonstration}>Generate Demonstration</button>;
};
