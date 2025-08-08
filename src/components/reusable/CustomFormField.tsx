import React from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormFieldType } from "@/lib/types"
import { Control } from "react-hook-form"
import classNames from "classnames"
import { Input } from "../ui/input"

interface CustomFormFieldProps {
  className?: string
  control: Control<any>
  fieldType: FormFieldType
  fieldTypeType?: string
  maxFiles?: number
  acceptedFiles?: Object
  name: string
  label?: string
  description?: string
  placeholder?: string
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
    fieldType,
    fieldTypeType,
    placeholder,
    maxFiles,
    acceptedFiles,
    className,
  } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            className={classNames("shad-input", className)}
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
    default:
      break
  }
}

const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, fieldType, name, label, description } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNames("flex flex-col")}>
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
