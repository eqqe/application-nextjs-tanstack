/* https://tailwindcss.com/docs/content-configuration#dynamic-class-names */
export const colSpans: Record<number, string> = {
    1: 'sm:col-span-8 md:col-span-6 lg:col-span-1',
    2: 'sm:col-span-8 md:col-span-6 lg:col-span-2',
    3: 'sm:col-span-8 md:col-span-8 lg:col-span-3',
    4: 'sm:col-span-8 md:col-span-8 lg:col-span-4',
    5: 'sm:col-span-10 md:col-span-8 lg:col-span-5',
    6: 'sm:col-span-10 md:col-span-10 lg:col-span-6',
    7: 'sm:col-span-12 md:col-span-10 lg:col-span-7',
    8: 'sm:col-span-12 md:col-span-10 lg:col-span-8',
    9: 'sm:col-span-12 md:col-span-10 lg:col-span-9',
    10: 'sm:col-span-12 md:col-span-10 lg:col-span-10',
    11: 'sm:col-span-12 md:col-span-12 lg:col-span-11',
    12: 'sm:col-span-12 md:col-span-12 lg:col-span-12',
};

export const paddingBottoms: Record<number, string> = {
    1: 'pb-1',
    2: 'pb-2',
    3: 'pb-3',
    4: 'pb-4',
    5: 'pb-5',
    6: 'pb-6',
};

export const textXl: Record<number, string> = {
    1: 'text-1xl',
    2: 'text-2xl',
    3: 'text-3xl',
    4: 'text-4xl',
};
