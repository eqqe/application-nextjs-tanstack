import * as React from 'react';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';
import { AutoFormInputComponentProps } from '../types';
import { CardTableComponent } from '@/components/Grid/Table/CardTableComponent';
import { useFormContext } from 'react-hook-form';
import { TypeTableRequest } from '@prisma/client';

function AutoFormSearch({ label, isRequired, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
    const { showLabel: _showLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;

    const search = fieldConfigItem.search;
    if (!search) {
        throw 'search should be configured for search autoform';
    }
    const { type, enableMultiRowSelection, where } = search;
    const { setValue } = useFormContext();
    const name = fieldProps.name;
    const onRowSelection = React.useCallback(
        (ids: string[]) =>
            setValue(
                name,
                ids.length
                    ? enableMultiRowSelection
                        ? ids.map((id) => ({ id }))
                        : { id: ids[0] }
                    : enableMultiRowSelection
                    ? []
                    : void 0
            ),
        [enableMultiRowSelection, name, setValue]
    );

    const table = React.useMemo(
        () => ({
            type,
            groupBy: null,
            chart: null,
            columns: [],
            typeTableRequest: TypeTableRequest.findMany,
        }),
        [type]
    );
    return (
        <FormItem className="flex w-full flex-col justify-start">
            {showLabel && <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />}
            <FormControl>
                <CardTableComponent
                    table={table}
                    pageSize={5}
                    editableItems={false}
                    onRowSelection={onRowSelection}
                    enableRowSelection={true}
                    enableMultiRowSelection={enableMultiRowSelection}
                    where={where}
                />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}

export default React.memo(AutoFormSearch);
