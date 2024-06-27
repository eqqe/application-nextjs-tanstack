import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthGuard from 'components/AuthGuard';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { ReactElement } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SelectedSpacesProvider } from '@/lib/context';
import { trpc } from '@/lib/trpc';
import { I18nProvider } from '../locales';

const queryClient = new QueryClient();

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <I18nProvider locale={pageProps.locale}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider session={session}>
                    <TooltipProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            <SelectedSpacesProvider>
                                <AppContent>
                                    <div className="h-100 grow">
                                        <Component {...pageProps} />
                                    </div>
                                </AppContent>
                            </SelectedSpacesProvider>
                        </ThemeProvider>
                    </TooltipProvider>
                </SessionProvider>
            </QueryClientProvider>
        </I18nProvider>
    );
}

function AppContent(props: { children: ReactElement | ReactElement[] }) {
    const theme = useTheme();
    return (
        <AuthGuard>
            <div className="flex h-screen flex-col">{props.children}</div>
            <ToastContainer theme={theme.theme} position="top-center" autoClose={2000} hideProgressBar={true} />
        </AuthGuard>
    );
}

// @ts-expect-error -----> Faster typescript inference of tRPC in VsCode by removing the recursion on type when createTRPCNext
export default trpc.withTRPC(App);
