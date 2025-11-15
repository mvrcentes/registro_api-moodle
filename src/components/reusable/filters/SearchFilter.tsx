import type React from "react"
import { Input } from "@/components/ui/input"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchFilter: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="max-w-[200px]"
    />
  )
}

export default SearchFilter
