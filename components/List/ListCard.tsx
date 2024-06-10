import { List } from '@prisma/client';
import TimeInfo from '@/components/TimeInfo';

export function ListCard({ list }: { list: List }) {
    return (
        <>
            List
            <TimeInfo value={list} />
        </>
    );
}
