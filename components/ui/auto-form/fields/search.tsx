import * as React from 'react';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';
import { AutoFormInputComponentProps } from '../types';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';
import { PropertyColumns } from '@/zmodel/prisma/applications/assets/columns';
import { useFormContext } from 'react-hook-form';

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
    const { type, enableMultiRowSelection } = search;
    const { setValue } = useFormContext();
    // TODO SRE : change not only properties !!!
    const onRowSelection = React.useCallback((id: string) => setValue('propertyId', id), [setValue]);
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
                    onRowSelection={onRowSelection}
                    enableRowSelection={true}
                    enableMultiRowSelection={enableMultiRowSelection}
                />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}
