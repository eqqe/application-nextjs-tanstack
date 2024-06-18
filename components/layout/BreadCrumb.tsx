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
import { getGridUrl, getPropertyUrl, getSubTabFolderUrl } from '@/lib/urls';
import { useCurrentGrid } from '@/hooks/useCurrentGrid';
import { useCurrentProperty } from '@/hooks/property/useCurrentProperty';

export function TopBreadCrumb() {
    const space = useCurrentSpace();
    const subTab = useCurrentSubTab();
    const grid = useCurrentGrid();
    const property = useCurrentProperty();

    const items: Array<{ text: string; link: string }> = [];

    const subTabInfo = subTab || grid?.subTab;
    if (subTabInfo) {
        items.push({
            link: getSubTabFolderUrl(subTabInfo.id),
            text: subTabInfo.name,
        });
    }
    if (grid) {
        items.push({
            link: getGridUrl(grid.id),
            text: grid.name,
        });
    }
    if (property) {
        items.push({
            link: getPropertyUrl(property.id),
            text: property.name,
        });
    }

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">{space?.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.slice(0, -1).map((item) => (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={item.link}>{item.text}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                ))}

                {items.length > 0 && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{items[items.length - 1].text}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
