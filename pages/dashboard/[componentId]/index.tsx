import { DashboardDetails } from '@/components/Dashboard/DashboardDetails';
import { WithNavBar } from '@/components/layout/WithNavBar';

export default function DashboardDetailsPage() {
    return (
        <WithNavBar>
            <DashboardDetails />
        </WithNavBar>
    );
}
