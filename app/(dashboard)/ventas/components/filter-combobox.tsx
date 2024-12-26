"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// local imports.
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StatusFilterComboboxProps {
    currentFilter: 'MONTHLY' | 'WEEKLY' | 'DAILY';
    currentMonthFilter: string | null;
    disabled?: boolean;
    className?: string;
};

const FilterCombobox: React.FC<StatusFilterComboboxProps> = ({
    currentFilter,
    currentMonthFilter,
    disabled,
    className,
}: StatusFilterComboboxProps) => {

    const [open, setOpen] = useState(false)
    const router = useRouter()

    const onFilterSelect = (newStatus: 'MONTHLY' | 'WEEKLY' | 'DAILY') => {
        if (currentFilter === newStatus) {
            router.push(`/ventas`)
        } else {
            router.push(`/ventas?filter=${newStatus}`)
        }
        setOpen(false)
    }

    const onMonthlyFilterSelect = (month: string) => {
        if (month === '99') {
            router.push(`/ventas`)
        } else {
            router.push(`/ventas?filter=MONTHLY&month=${month}`)
        }
        setOpen(false)
    }

    const filterList = [
        { name: 'Del mes', value: 'MONTHLY' },
        { name: 'De la semana', value: 'WEEKLY' },
        { name: 'Del día', value: 'DAILY' },
    ]

    const months = [
        { name: 'Diciembre', value: '11' },
        { name: 'Noviembre', value: '10' },
        { name: 'Octubre', value: '9' },
        { name: 'Septiembre', value: '8' },
        { name: 'Agosto', value: '7' },
        { name: 'Julio', value: '6' },
        { name: 'Junio', value: '5' },
        { name: 'Mayo', value: '4' },
        { name: 'Abril', value: '3' },
        { name: 'Marzo', value: '2' },
        { name: 'Febrero', value: '1' },
        { name: 'Enero', value: '0' },
    ]

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen} >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Selecciona un filtro rápido"
                        type="button"
                        className={cn("w-fit justify-between", className)}
                        disabled={disabled}
                    >
                        <div className="flex items-center gap-x-2">
                            {currentFilter ?
                                currentFilter === 'MONTHLY' ?
                                    <Badge>
                                        {months.find((month) => month.value === currentMonthFilter)?.name.toUpperCase()}
                                    </Badge>
                                    :
                                    <Badge>
                                        {filterList.find((filter) => filter.value === currentFilter)?.name.toUpperCase()}
                                    </Badge>
                                :
                                <div>Filtros rápidos</div>
                            }
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <DropdownMenuLabel>Filtros rápidos</DropdownMenuLabel>
                    <DropdownMenuSeparator className="" />
                    {filterList.map((filter) => (
                        filter.value === 'MONTHLY' ?
                            <DropdownMenuSub key={filter.value}>
                                <DropdownMenuSubTrigger>
                                    <div className="truncate">
                                        {filter.name}
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onSelect={() => onMonthlyFilterSelect('99')}
                                            className="cursor-pointer"
                                        >
                                            Todos
                                        </DropdownMenuItem>
                                        {months.map((month) => (
                                            <DropdownMenuItem
                                                key={month.value}
                                                onSelect={() => onMonthlyFilterSelect(month.value)}
                                                className="cursor-pointer"
                                            >
                                                {month.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        currentMonthFilter === month.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>

                            :
                            <DropdownMenuItem
                                key={filter.value}
                                onSelect={() => onFilterSelect(filter.value as 'MONTHLY' | 'WEEKLY' | 'DAILY')}
                                className="cursor-pointer"
                            >
                                <div className="truncate">
                                    {filter.name}
                                </div>
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        currentFilter === filter.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </DropdownMenuItem>
                    ))}
                    {/* </CommandGroup>
                        </CommandList>
                    </Command> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default FilterCombobox;