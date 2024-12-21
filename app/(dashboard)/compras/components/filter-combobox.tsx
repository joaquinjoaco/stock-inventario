"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// local imports.
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandList,
    CommandItem,
    CommandGroup,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StatusFilterComboboxProps extends PopoverTriggerProps {
    currentFilter: 'MONTHLY' | 'WEEKLY' | 'DAILY'
    disabled?: boolean;
    className?: string;
};

const FilterCombobox: React.FC<StatusFilterComboboxProps> = ({
    currentFilter,
    disabled,
    className,
}: StatusFilterComboboxProps) => {

    const [open, setOpen] = useState(false)
    const router = useRouter()

    const onStatusSelect = (newStatus: 'MONTHLY' | 'WEEKLY' | 'DAILY') => {
        if (currentFilter === newStatus) {
            router.push(`/compras`)
        } else {
            router.push(`/compras?filter=${newStatus}`)
        }
        setOpen(false)
    }

    const filterList = [
        { name: 'Del mes', value: 'MONTHLY' },
        { name: 'De la semana', value: 'WEEKLY' },
        { name: 'Del día', value: 'DAILY' },
    ]

    return (
        <>
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Selecciona un estado"
                        type="button"
                        className={cn("w-fit justify-between", className)}
                        disabled={disabled}
                    >
                        <div className="flex items-center gap-x-2">
                            {currentFilter ?
                                <Badge>
                                    {filterList.find((filter) => filter.value === currentFilter)?.name.toUpperCase()}
                                </Badge>
                                :
                                <div>Todos</div>
                            }
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Estados">
                                {filterList.map((filter) => (
                                    <CommandItem
                                        key={filter.value}
                                        onSelect={() => onStatusSelect(filter.value as 'MONTHLY' | 'WEEKLY' | 'DAILY')}
                                        className="cursor-pointer"
                                    >
                                        <div className="truncate">
                                            <Badge>
                                                {filter.name.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentFilter === filter.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default FilterCombobox;