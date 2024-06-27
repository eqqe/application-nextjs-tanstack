import { createI18n } from 'next-international';

export const { useI18n, useScopedI18n, I18nProvider, getLocaleProps, useChangeLocale, useCurrentLocale } = createI18n({
    fr: () => import('./fr'),
    en: () => import('./en'),
});
