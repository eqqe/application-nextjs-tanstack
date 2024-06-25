import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { useQueryClient } from '@tanstack/react-query';
import debounce from 'debounce';

export function TopLoadingBar() {
    const [progress, setProgress] = React.useState(0);
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const debounceLoading = debounce(() => {
            const updateIsLoading = queryClient.isFetching() > 0 || queryClient.isMutating() > 0;
            console.log('set state is loading');
            setIsLoading(updateIsLoading);
        }, 200);

        const unsubscribe = queryClient.getQueryCache().subscribe(debounceLoading);
        return () => {
            debounceLoading.clear();
            unsubscribe();
        };
    }, [queryClient]);

    React.useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            setProgress(0);

            const incrementProgress = () => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
            };
            interval = setInterval(incrementProgress, 50);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isLoading]);

    return (
        <div className="fixed left-0 top-0 z-50 w-full">
            {isLoading ? <Progress value={progress} className="h-1 w-full" /> : ''}
        </div>
    );
}
