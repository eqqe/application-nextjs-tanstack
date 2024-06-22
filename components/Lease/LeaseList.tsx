import { dateFormat } from '@/lib/utils';
import { Lease } from '@prisma/client';
export default function LeaseDetail({ lease }: { lease: Lease }) {
    return (
        <div className="card shadow-lg">
            <div className="card-body">
                <h3 className="card-title">Lease</h3>
                <p>Start Date: {dateFormat(lease.startDate)}</p>
                <p>End Date: {lease.endDate ? dateFormat(new Date(lease.endDate)) : 'N/A'}</p>
                <p>Rent Amount: ${lease.rentAmount.toString()}</p>
            </div>
        </div>
    );
}
