import { useSearchParams } from 'next/navigation';

export function useGlobalFilter() {
    const searchParams = useSearchParams();
    return searchParams.get('q');
}
