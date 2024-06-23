import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Prisma } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const dateFormat = (date: Date) => format(date, 'yyyy-MM-dd');
export const orderByCreatedAt = {
    orderBy: {
        createdAt: Prisma.SortOrder.desc,
    },
};
export const orderByIndex = {
    orderBy: {
        index: Prisma.SortOrder.asc,
    },
};
