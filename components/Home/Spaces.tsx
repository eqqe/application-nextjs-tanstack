import { getSpaceUrl } from '@/lib/urls';
import { orderByCreatedAt } from '@/lib/utils';
import { useFindManySpace } from '@/zmodel/lib/hooks';
import { Space } from '@prisma/client';
import Link from 'next/link';

function SpaceItem({ space }: { space: Space }) {
    return (
        <Link href={getSpaceUrl(space.id)}>
            <div className="relative flex size-full items-center justify-center">
                <div>
                    <h2 className="card-title line-clamp-1">{space.name}</h2>
                </div>
            </div>
        </Link>
    );
}

export function Spaces() {
    const { data: spaces } = useFindManySpace(orderByCreatedAt);
    return (
        <ul className="flex flex-wrap gap-4">
            {spaces?.map((space) => (
                <li
                    className="card h-32 w-80 cursor-pointer border text-gray-600 shadow-xl hover:bg-gray-50"
                    key={space.id}
                >
                    <SpaceItem space={space} />
                </li>
            ))}
        </ul>
    );
}
