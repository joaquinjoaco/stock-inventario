"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StatusFilterComboboxProps {
    currentFilter: string | null;
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

    const onFilterSelect = (newStatus: 'OOS') => {
        if (currentFilter === newStatus) {
            router.push(`/inventario`)
        } else {
            router.push(`/inventario?filter=${newStatus}`)
        }
        setOpen(false)
    }

    const filterList = [
        { name: 'Sin stock', value: 'OOS' },

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
                <DropdownMenuContent>
                    <DropdownMenuLabel>Filtros rápidos</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterList.map((filter) => (
                        <DropdownMenuItem
                            key={filter.value}
                            onSelect={() => onFilterSelect(filter.value as 'OOS')}
                            className="cursor-pointer "
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
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default FilterCombobox;