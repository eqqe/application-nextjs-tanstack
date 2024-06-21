import { FolderKey, SquareUser, User, Users, Home, Gauge } from 'lucide-react';
import { IconName } from '@prisma/client';

export function getLucideIcon({ icon }: { icon: IconName | null }) {
    if (!icon) {
        return null;
    }
    switch (icon) {
        case 'FolderKey':
            return <FolderKey />;
        case 'SquareUser':
            return <SquareUser />;
        case 'User':
            return <User />;
        case 'Users':
            return <Users />;
        case 'Home':
            return <Home />;
        case 'Gauge':
            return <Gauge />;
    }
}
