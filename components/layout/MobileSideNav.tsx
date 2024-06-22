import { useNavItems } from '@/hooks/useNavItems';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LineChart, Package, PanelLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { settingsUrl } from '@/lib/urls';

export const MobileSideNav = () => {
    const items = useNavItems();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    {items?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                        >
                            {item.icon ? item.icon : <Package />}
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        href={settingsUrl}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    >
                        <LineChart />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
};
