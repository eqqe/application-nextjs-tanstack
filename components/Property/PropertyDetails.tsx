import { useCreateLease } from '@/zmodel/lib/hooks';
import LeaseDetail from 'components/Lease/LeaseList';
import { LeaseCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { AutoFormDialog } from '@/components/Form/CreateForm';
import { useCurrentProperty } from '@/hooks/property/useCurrentProperty';

export function PropertyDetails() {
    const property = useCurrentProperty();
    const createLease = useCreateLease();

    return (
        <>
            <h1 className="mb-4 text-2xl font-semibold">{property?.streetAddress}</h1>
            <div className="flex space-x-2">
                <div className="mb-8 flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <AutoFormDialog
                        formSchema={LeaseCreateScalarSchema}
                        onSubmitData={async (data) => {
                            if (!property) {
                                throw 'Error no property';
                            }
                            await createLease.mutateAsync({
                                data: {
                                    ...data,
                                    propertyId: property.id,
                                },
                            });
                        }}
                        title={'Create Lease'}
                    />
                </div>
            </div>
            <ul className="flex w-11/12 flex-col space-y-4 py-8 md:w-auto">
                {property?.leases?.map((lease) => (
                    <LeaseDetail key={lease.id} {...{ lease }} />
                ))}
            </ul>
        </>
    );
}
