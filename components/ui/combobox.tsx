"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  items: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  createItem?: (value: string) => { label: string; value: string }
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an item",
  createItem,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue === value ? "" : selectedValue)
    setOpen(false)
  }
  

  const handleCreateItem = () => {
    if (createItem && inputValue.trim()) {
      const newItem = createItem(inputValue.trim())
      onChange(newItem.value)
      setOpen(false)
      setInputValue("")
    }
  }

  const displayValue = React.useMemo(() => {
    const selectedItem = items.find((item) => item.value === value)
    return selectedItem ? selectedItem.label : value
  }, [items, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {createItem && inputValue ? (
                <button
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={handleCreateItem}
                >
                  Create "{inputValue}"
                </button>
              ) : (
                "No item found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => handleSelect(currentValue)}

              >
              
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
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
