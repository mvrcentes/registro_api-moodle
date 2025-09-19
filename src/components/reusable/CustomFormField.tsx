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
import { Control, useFormContext } from "react-hook-form"
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
    form: propForm,
    fieldType,
    placeholder,
    className,
    fieldValues,
    readonly,
    onScrollBottom,
    onSearchChange,

    children,
  } = props

  // Obtener la instancia del formulario desde el contexto si no se pasó como prop
  const formContext = useFormContext()
  const form = propForm || formContext

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            className={classNames("shad-input", className)}
            readOnly={readonly}
            disabled={readonly}
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
            disabled={readonly}
          />
        </FormControl>
      )
    case FormFieldType.NUMERIC_ONLY:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type="text"
            value={field.value || ''}
            className={classNames("shad-input", className)}
            readOnly={readonly}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              // Convertir a número si hay valor, o undefined si está vacío
              const numericValue = value === '' ? undefined : parseInt(value, 10);
              field.onChange(numericValue);
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
              }
            }}
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
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={readonly}>
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
          readonly={readonly}
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
