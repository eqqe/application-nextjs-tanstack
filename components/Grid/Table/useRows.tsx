import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { getTypeHook } from './getTypeHook';
import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { CardTableComponentProps } from './CardTableComponent';
import { CreateForm } from '@/components/Form/CreateForm';
import { ReactNode, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';

export function useRows({ table: { type, columns, typeTableRequest, groupBy } }: CardTableComponentProps) {}
