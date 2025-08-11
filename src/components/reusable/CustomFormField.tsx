import React from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ComboXSelect, FormFieldType } from "@/lib/types"
import { Control } from "react-hook-form"
import classNames from "classnames"
import { Input } from "../ui/input"
import { SelectItemField } from "./SelectItemField"
import { Select } from "@radix-ui/react-select"
import { cn } from "@/lib/utils"
import { SelectContent, SelectTrigger, SelectValue } from "../ui/select"

interface CustomFormFieldProps {
  className?: string
  form?: any
  control?: Control<any>
  fieldType: FormFieldType
  fieldTypeType?: string
  maxFiles?: number
  acceptedFiles?: Object
  name: string
  label?: string
  description?: string
  placeholder?: string

  children?: React.ReactNode

  fieldValues?: ComboXSelect[]
  onScrollBottom?: () => void
  onSearchChange?: (value: string) => void

  readonly?: boolean
}

const RenderField = ({
  field,
  props,
}: {
  field: any
  props: CustomFormFieldProps
}) => {
  if (!props) return null

  const {
    form,
    fieldType,
    placeholder,
    className,
    fieldValues,
    readonly,
    onScrollBottom,
    onSearchChange,

    children,
  } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            className={classNames("shad-input", className)}
            readOnly={readonly}
          />
        </FormControl>
      )
    case FormFieldType.TEXT:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            className={classNames("shad-input", className)}
            readOnly={readonly}
          />
        </FormControl>
      )
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type="number"
            className={classNames("shad-input", className)}
            readOnly={readonly}
          />
        </FormControl>
      )
    case FormFieldType.PASSWORD:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type="password"
            className={classNames("shad-input", className)}
          />
        </FormControl>
      )
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className={cn(className)}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>{children}</SelectContent>
        </Select>
      )
    case FormFieldType.SELECT_ITEM:
      return (
        <SelectItemField
          field={field}
          form={form}
          placeholder={placeholder}
          fieldValues={fieldValues!}
          onSearchChange={props.onSearchChange}
          onScrollBottom={props.onScrollBottom}
        />
      )
    default:
      break
  }
}

const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, fieldType, name, label, description, className } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNames("flex flex-col", className)}>
          {label && <FormLabel> {label} </FormLabel>}

          <RenderField field={field} props={props} />

          {description && (
            <FormDescription className="text-sm text-muted-foreground">
              {description}
            </FormDescription>
          )}

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
