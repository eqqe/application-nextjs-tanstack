import { PropertyDetails } from '@/components/Property/PropertyDetails';
import { WithNavBar } from '@/components/layout/WithNavBar';

export default function PropertyDetailsPage() {
    return (
        <WithNavBar>
            <PropertyDetails />
        </WithNavBar>
    );
}
