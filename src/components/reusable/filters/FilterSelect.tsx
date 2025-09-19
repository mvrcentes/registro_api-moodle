"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectOption<T extends string = string> = {
  value: T
  label: string
}

interface Props<T extends string = string> {
  value?: T
  onChange: (value: T | undefined) => void
  options: SelectOption<T>[]
  placeholder?: string
  className?: string
  searchable?: boolean
  emptyText?: string
}

export function FilterSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  className,
  searchable = true,
  emptyText = "Sin resultados",
}: Props<T>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!searchable || !query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, searchable, query])

  const current = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-9 w-[200px] min-w-0 px-3 justify-between",
            !current && "text-muted-foreground",
            className
          )}>
          <span
            className="truncate"
            title={current ? current.label : placeholder}
          >
            {current ? current.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          {searchable && (
            <CommandInput
              placeholder="Buscar…"
              value={query}
              onValueChange={setQuery}
            />
          )}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {/* Opción limpiar */}
              {value && (
                <CommandItem
                  key="__clear__"
                  value="__clear__"
                  onSelect={() => {
                    onChange(undefined)
                    setOpen(false)
                  }}>
                  Limpiar filtro
                </CommandItem>
              )}
              {filtered.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={() => {
                    onChange(o.value as T)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      o.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
