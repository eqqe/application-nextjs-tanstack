import { SubTabFolderScalarSchema } from '@zenstackhq/runtime/zod/models';
import { AutoTable } from '@/components/AutoTable/AutoTable';
import { useFindManySubTabFolder } from '@/zmodel/lib/hooks';

export function SpaceHomeComponent() {
    const { data: subTabs } = useFindManySubTabFolder();

    return <AutoTable type={'SubTabFolder'} data={subTabs ?? []} formSchema={SubTabFolderScalarSchema} />;
}
