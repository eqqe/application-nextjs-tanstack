import { GridScalarSchema } from '@zenstackhq/runtime/zod/models';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { useCurrentSubTab } from '@/hooks/useCurrentSubTab';

export const SubTab = () => {
    const subTab = useCurrentSubTab();
    return <AutoTable type={'Grid'} data={subTab?.grids ?? []} formSchema={GridScalarSchema} />;
};
