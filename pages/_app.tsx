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
import Head from 'next/head';
import { I18nProvider } from '../locales';
import frLocale from '../locales/fr';
const queryClient = new QueryClient();

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <title>My awesome PWA app</title>
                <meta name="description" content="Best PWA app in the world!" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://yourdomain.com" />
                <meta name="twitter:title" content="My awesome PWA app" />
                <meta name="twitter:description" content="Best PWA app in the world!" />
                <meta name="twitter:image" content="/icons/twitter.png" />
                <meta name="twitter:creator" content="@DavidWShadow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="My Awesome PWA app" />
                <meta property="og:description" content="Best PWA app in the world!" />
                <meta property="og:site_name" content="My awesome PWA app" />
                <meta property="og:url" content="https://yourdomain.com" />
                <meta property="og:image" content="/icons/og.png" />
                {/* add the following only if you want to add a startup image for Apple devices. */}
                <link rel="apple-touch-startup-image" href="/images/apple_splash_2048.png" sizes="2048x2732" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_1668.png" sizes="1668x2224" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_1536.png" sizes="1536x2048" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_1125.png" sizes="1125x2436" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_1242.png" sizes="1242x2208" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_750.png" sizes="750x1334" />
                <link rel="apple-touch-startup-image" href="/images/apple_splash_640.png" sizes="640x1136" />
            </Head>
            <I18nProvider locale={frLocale}>
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
        </>
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

import { headers } from 'next/headers';
import { Viewport } from 'next';

// eslint-disable-next-line require-await
export async function generateViewport(): Promise<Viewport> {
    const userAgent = headers().get('user-agent');
    const isiPhone = /iphone/i.test(userAgent ?? '');
    return isiPhone
        ? {
              width: 'device-width',
              initialScale: 1,
              maximumScale: 1, // disables auto-zoom on ios safari
          }
        : {};
}
