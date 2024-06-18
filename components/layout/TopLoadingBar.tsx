import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { useQueryClient } from '@tanstack/react-query';

export function TopLoadingBar() {
    const [progress, setProgress] = React.useState(0);
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const handleFetchStart = () => {
            setProgress(0);
        };

        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event.query.isActive()) {
                handleFetchStart();
            }
        });

        const incrementProgress = () => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
        };

        const interval = setInterval(incrementProgress, 50);

        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, [queryClient]);

    return (
        <div className="fixed left-0 top-0 z-50 w-full">
            {queryClient.isFetching() || queryClient.isMutating() ? (
                <Progress value={progress} className="h-1 w-full" />
            ) : (
                ''
            )}
        </div>
    );
}
