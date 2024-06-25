import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { createTRPCNext } from '@/server/routers/generated/client/next';

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    } else {
        return `http://localhost:${process.env.PORT ?? 3000}`;
    }
}

export const trpc = createTRPCNext({
    config({ ctx }) {
        return {
            transformer: superjson,
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        };
    },
    ssr: false,
});
