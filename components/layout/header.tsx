import { Button } from '@/components/ui/button';
import {
    Cloud,
    CreditCard,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Search,
    Settings,
    User,
    UserPlus,
    Users,
    Moon,
    Globe,
} from 'lucide-react';
import { TopBreadCrumb } from './BreadCrumb';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { MobileSideNav } from './MobileSideNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentSessionUser } from '@/lib/context';
import { ModeToggle } from './ModeToggle';
import { SpaceSwitch } from './SpaceSwitch';
import { useRouter } from 'next/router';
import { profilesUrl, settingsUrl, userUrl } from '@/lib/urls';
import { useChangeLocale, useCurrentLocale } from '@/locales';

export default function Header() {
    const user = useCurrentSessionUser();
    const router = useRouter();
    const changeLocale = useChangeLocale();
    const locale = useCurrentLocale();
    return (
        <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileSideNav />
            <TopBreadCrumb />
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[320px]"
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            router.push(`/search?q=${(e.target as HTMLInputElement).value}`);
                        }
                    }}
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative size-8 rounded-full focus-visible:ring-0">
                        <Avatar className="size-8">
                            <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
                            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-3 mt-2 w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push(userUrl)}>
                            <User className="mr-2 size-4" />
                            <span>User</span>
                            <DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 size-4" />
                            <span>Billing</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(settingsUrl)}>
                            <Settings className="mr-2 size-4" />
                            <span>Settings</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Keyboard className="mr-2 size-4" />
                            <span>Keyboard shortcuts</span>
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push(profilesUrl)}>
                            <Users className="mr-2 size-4" />
                            <span>Profiles</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <UserPlus className="mr-2 size-4" />
                                <span>Invite users</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <Mail className="mr-2 size-4" />
                                        <span>Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquare className="mr-2 size-4" />
                                        <span>Message</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <PlusCircle className="mr-2 size-4" />
                                        <span>More...</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Globe className="mr-2 size-4" />
                                <span>Switch language</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => changeLocale('en')}>
                                        <span>English</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => changeLocale('fr')}>
                                        <span>French</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>
                            <Plus className="mr-2 size-4" />
                            <span>New Team</span>
                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 size-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <Cloud className="mr-2 size-4" />
                        <span>API</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 size-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            <SpaceSwitch />
        </header>
    );
}
