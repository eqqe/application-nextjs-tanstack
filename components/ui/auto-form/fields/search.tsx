import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';
import { AutoFormInputComponentProps } from '../types';
import { getTypeHook } from '@/components/Grid/Table/getTypeHook';
import { beautifyObjectName } from '../utils';

export default function AutoFormSearch({
    label,
    isRequired,
    fieldConfigItem,
    field,
    fieldProps,
}: AutoFormInputComponentProps) {
    const { showLabel: _showLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;

    const [open, setOpen] = React.useState(false);
    const search = fieldConfigItem.search;
    if (!search) {
        throw 'search should be configured for search autoform';
    }
    const { type, where } = search;

    const typeHook = getTypeHook({ type });
    // @ts-expect-error
    const res = typeHook.useHook.FindMany({ where });
    let data: { id: string; name: string }[] | undefined = res.data;
    if (!data) {
        return 'loading';
    }

    return (
        <FormItem className="flex w-full flex-col justify-start">
            {showLabel && <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />}

            <FormControl>
                <Popover open={open} onOpenChange={setOpen} {...fieldProps}>
                    <PopoverTrigger asChild className={fieldProps.className}>
                        <Button variant="outline" role="combobox" aria-expanded={open}>
                            {field.value
                                ? data.find((item) => item.id === field.value)?.name
                                : `Select ${beautifyObjectName(type)}...`}
                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder={`Search ${beautifyObjectName(type)}...`} />
                            <CommandList>
                                <CommandEmpty>No {beautifyObjectName(type)} found.</CommandEmpty>
                                <CommandGroup>
                                    {data.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={(currentValue) => {
                                                field.onChange(currentValue === field.value ? '' : currentValue);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 size-4',
                                                    field.value === item.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {item.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}
