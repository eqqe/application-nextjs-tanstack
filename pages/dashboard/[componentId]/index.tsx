import { DashboardDetails } from '@/components/SpaceComponent/Dashboard/DashboardDetails';
import { WithNavBar } from '@/components/layout/WithNavBar';

export default function DashboardDetailsPage() {
    return (
        <WithNavBar>
            <DashboardDetails />
        </WithNavBar>
    );
}
