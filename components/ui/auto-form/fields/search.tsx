import * as React from 'react';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';
import { AutoFormInputComponentProps } from '../types';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';
import { PropertyColumns } from '@/zmodel/prisma/applications/assets/columns';

export default function AutoFormSearch({
    label,
    isRequired,
    fieldConfigItem,
    fieldProps,
}: AutoFormInputComponentProps) {
    const { showLabel: _showLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;

    const search = fieldConfigItem.search;
    if (!search) {
        throw 'search should be configured for search autoform';
    }
    const { type } = search;

    return (
        <FormItem className="flex w-full flex-col justify-start">
            {showLabel && <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />}
            <FormControl>
                <CardTableComponent
                    table={{
                        type,
                        groupBy: null,
                        chart: null,
                        columns: [
                            PropertyColumns.name,
                            PropertyColumns.city,
                            PropertyColumns.postalCode,
                            PropertyColumns.surface,
                        ],
                        typeTableRequest: 'FindMany',
                    }}
                    pageSize={5}
                    editableItems={false}
                />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}
