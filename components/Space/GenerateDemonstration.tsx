import { useCreateProperty, useUpdateSpace } from '@/zmodel/lib/hooks';
import {
    cityPlaywrightTest,
    fakeCharge,
    fakeLease,
    fakePayment,
    fakePerson,
    fakeProperty,
    fakePropertyAssociate,
    generateData,
} from '@/lib/demo/fake';
import { useCurrentSpace } from '@/lib/context';

export const GenerateDemonstration = () => {
    const currentSpace = useCurrentSpace();
    const updateSpace = useUpdateSpace();
    if (!currentSpace) {
        return <></>;
    }

    const generateDemonstration = async ({ length }: { length: number }) => {
        const updateSpaceArgs = generateData({ length, currentSpace });

        updateSpaceArgs.data.properties.create[0].city = cityPlaywrightTest;

        await updateSpace.mutateAsync(updateSpaceArgs);
    };

    return <button onClick={() => generateDemonstration({ length: 7 })}>Generate Demonstration</button>;
};
