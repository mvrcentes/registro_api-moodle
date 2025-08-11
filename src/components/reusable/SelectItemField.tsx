// SelectItemField.tsx
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
import { FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ComboXSelect } from "@/lib/types"

interface SelectItemFieldProps {
  field: any
  form: any
  placeholder?: string
  fieldValues: ComboXSelect[]
  onScrollBottom?: () => void
  onSearchChange?: (value: string) => void
}

export const SelectItemField = ({
  field,
  form,
  placeholder,
  fieldValues,
  onScrollBottom,
  onSearchChange,
}: SelectItemFieldProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "max-w-full overflow-hidden whitespace-nowrap text-ellipsis",
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
            onClick={() => setOpen(true)}>
            <span className="truncate">
              {field.value
                ? fieldValues.find((item) => item.value === field.value)?.label
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 overflow-hidden">
        <Command className="max-h-[300px] overflow-y-auto">
          <CommandInput
            placeholder="Buscar..."
            onValueChange={(value) => {
              onSearchChange?.(value)
            }}
          />
          <CommandList
            onScroll={(e) => {
              const el = e.currentTarget
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
                onScrollBottom?.() // solo si se llegó al fondo
              }
            }}>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {fieldValues.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    form.setValue(field.name, item.value)
                    field.onChange(item.value)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
