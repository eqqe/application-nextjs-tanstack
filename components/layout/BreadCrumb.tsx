import { useCurrentSpace } from '@/lib/context';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useCurrentSubTab } from '@/hooks/useCurrentSubTab';
import { getGridUrl, getSubTabFolderUrl } from '@/lib/urls';
import { useCurrentGrid } from '@/hooks/useCurrentGrid';
import { useCurrentProperty } from '@/hooks/property/useCurrentProperty';

export function TopBreadCrumb() {
    const space = useCurrentSpace();
    const subTab = useCurrentSubTab();
    const grid = useCurrentGrid();

    const items: Array<{ text: string; link: string; id: string }> = [];

    const subTabInfo = subTab || grid?.subTab;
    if (subTabInfo) {
        items.push({
            link: getSubTabFolderUrl(subTabInfo.id),
            text: subTabInfo.name,
            id: subTabInfo.id,
        });
    }
    if (grid) {
        items.push({
            link: getGridUrl(grid.id),
            text: grid.name,
            id: grid.id,
        });
    }
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem key={'/'}>
                    <BreadcrumbLink asChild>
                        <Link href="/">{space?.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.slice(0, -1).map((item) => (
                    <>
                        <BreadcrumbSeparator key={`separator-${item.id}`} />
                        <BreadcrumbItem key={`item-${item.id}`}>
                            <BreadcrumbLink asChild>
                                <Link href={item.link}>{item.text}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                ))}

                {items.length > 0 && (
                    <>
                        <BreadcrumbSeparator key={`separator-${items[items.length - 1].id}`} />
                        <BreadcrumbItem key={`item-${items[items.length - 1].id}`}>
                            <BreadcrumbPage>{items[items.length - 1].text}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
