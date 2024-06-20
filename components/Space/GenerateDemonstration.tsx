import { useUpdateSpace } from '@/zmodel/lib/hooks';
import { cityPlaywrightTest, generateData } from '@/lib/demo/fake';
import { useSelectedSpaces } from '@/lib/context';

export const lenghtDemo = 3;
export const GenerateDemonstration = () => {
    const updateSpace = useUpdateSpace();
    const { selectedSpaces } = useSelectedSpaces();
    const generateDemonstration = async () => {
        const updateSpaceArgs = generateData({ length: lenghtDemo, spaceId: selectedSpaces[0] });

        updateSpaceArgs.data.properties.create[lenghtDemo - 1].city = cityPlaywrightTest;

        await updateSpace.mutateAsync(updateSpaceArgs);
    };

    return <button onClick={() => generateDemonstration()}>Generate Demonstration</button>;
};
