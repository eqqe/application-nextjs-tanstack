import { cityPlaywrightTest, generateData } from '@/lib/demo/fake';
import { useSelectedSpaces } from '@/lib/context';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';

export const lenghtDemo = 3;
export const GenerateDemonstration = () => {
    const updateSpace = trpc.space.update.useMutation();
    const { selectedSpaces } = useSelectedSpaces();

    const queryClient = useQueryClient();
    const generateDemonstration = async () => {
        const updateSpaceArgs = generateData({ length: lenghtDemo, spaceId: selectedSpaces[0] });

        updateSpaceArgs.data.properties.create[lenghtDemo - 1].city = cityPlaywrightTest;

        await updateSpace.mutateAsync(updateSpaceArgs);

        queryClient.refetchQueries();
    };

    return <button onClick={() => generateDemonstration()}>Generate Demonstration</button>;
};
