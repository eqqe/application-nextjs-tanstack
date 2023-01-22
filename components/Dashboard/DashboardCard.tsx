import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Dashboard, Property, List } from '@zenstackhq/runtime/models';
import { ReactNode } from 'react';

export function SpaceComponentCard({
    spaceComponent,
    children,
}: {
    spaceComponent: Dashboard | List | Property;
    children: ReactNode;
}) {
    return (
        <div className="card shadow-lg">
            <div className="card-body">
                <h3 className="card-title">{spaceComponent.name}</h3>
                {children}
                <div className="card-actions flex w-full justify-between">
                    <div className="flex space-x-2">
                        {spaceComponent.private && (
                            <div className="tooltip" data-tip="Private">
                                <LockClosedIcon className="size-4 text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
