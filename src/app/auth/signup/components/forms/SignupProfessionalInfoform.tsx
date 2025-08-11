"use client"

import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { COLEGIO_OPTIONS } from "./types"

type Props = {
  onValidityChange?: (valid: boolean) => void
}

const SignupProfessionalInfoform = ({ onValidityChange }: Props) => {
  const form = useFormContext()

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(form.formState.isValid)
    }
  }, [form.formState.isValid, onValidityChange])

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-4">
        <CustomFormField
          name="nombre_colegio_profesional"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Nombre del colegio profesional"
          placeholder="Escoja el nombre del colegio profesional"
          fieldValues={COLEGIO_OPTIONS}
        />

        <CustomFormField
          name="numero_colegiado"
          fieldType={FormFieldType.NUMBER}
          form={form}
          label="Número de colegiado"
          placeholder="Ingrese su número de colegiado"
        />
      </div>
    </Form>
  )
}

export default SignupProfessionalInfoform
