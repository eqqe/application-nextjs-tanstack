import { useFindManySpace, useFindUniqueSpace } from '@/zmodel/lib/hooks';
import { useSession } from 'next-auth/react';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Space } from '@zenstackhq/runtime/models';

export type SelectedSpaces = string[];

export const selectedSpacesCookieName = (userId: string) => `${userId}-selectedSpaces`;

type SelectedSpacesContextType = {
    selectedSpaces: SelectedSpaces;
    switchSpace: (props: { space: Space }) => void;
};

const SelectedSpacesContext = createContext<SelectedSpacesContextType | undefined>(undefined);

export const useSelectedSpaces = () => {
    const context = useContext(SelectedSpacesContext);
    if (context === undefined) {
        throw new Error('useSelectedSpaces must be used within a SelectedSpacesProvider');
    }
    return context;
};

export const useCurrentSpace = () => {
    const { selectedSpaces } = useSelectedSpaces();

    const { data: spaces } = useFindManySpace();

    if (spaces && spaces.length) {
        return spaces.find((space) => space.id === selectedSpaces[0]);
    }
    return undefined;
};

export const SelectedSpacesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedSpaces, setSelectedSpaces] = useState<SelectedSpaces>([]);

    const currentUser = useCurrentUser();
    const queryClient = useQueryClient();

    const { data: spaces } = useFindManySpace();

    useEffect(() => {
        if (currentUser) {
            const cookieName = selectedSpacesCookieName(currentUser.id);
            const cookie = getCookie(cookieName);
            if (cookie) {
                setSelectedSpaces(JSON.parse(cookie));
            } else if (spaces && spaces.length) {
                const initialSpaces: SelectedSpaces = [spaces[0].id];
                setSelectedSpaces(initialSpaces);
                setCookie(cookieName, JSON.stringify(initialSpaces));
            }
        }
    }, [currentUser, spaces]);

    const switchSpace = ({ space }: { space: Space }) => {
        if (currentUser) {
            const updatedSelectedSpaces: SelectedSpaces = [space.id];
            setSelectedSpaces(updatedSelectedSpaces);
            const cookieName = selectedSpacesCookieName(currentUser.id);
            setCookie(cookieName, JSON.stringify(updatedSelectedSpaces));
            queryClient.refetchQueries({ queryKey: ['zenstack'] });
        }
    };

    return (
        <SelectedSpacesContext.Provider value={{ selectedSpaces, switchSpace }}>
            {children}
        </SelectedSpacesContext.Provider>
    );
};

export function useCurrentUser() {
    const { data: session } = useSession();
    return session?.user;
}

export function useComponentIdRouter() {
    const router = useRouter();
    const componentId = router.query.componentId;
    if (typeof componentId === 'string') {
        return componentId;
    }
}