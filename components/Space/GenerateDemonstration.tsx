import { useUpdateSpace } from '@/zmodel/lib/hooks';
import { cityPlaywrightTest, generateData } from '@/lib/demo/fake';
import { useSelectedSpaces } from '@/lib/context';

export const GenerateDemonstration = () => {
    const updateSpace = useUpdateSpace();

    const { selectedSpaces } = useSelectedSpaces();
    const generateDemonstration = async ({ length }: { length: number }) => {
        const updateSpaceArgs = generateData({ length, spaceId: selectedSpaces[0] });

        updateSpaceArgs.data.properties.create[length - 1].city = cityPlaywrightTest;

        await updateSpace.mutateAsync(updateSpaceArgs);
    };

    return <button onClick={() => generateDemonstration({ length: 7 })}>Generate Demonstration</button>;
};
