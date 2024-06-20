import { SubTabFolderScalarSchema } from '@zenstackhq/runtime/zod/models';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { useSubTabs } from '@/lib/context';

export function SpaceHomeComponent() {
    const subTabs = useSubTabs();
    return <AutoTable type={'SubTabFolder'} data={subTabs ?? []} formSchema={SubTabFolderScalarSchema} />;
}
