"use client"

import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { COLEGIO_OPTIONS } from "./types"
import { SignupProfessionalInfoSchema } from "@/features/auth/schemas/auth.schema"

type Props = {
  onValidityChange?: (valid: boolean) => void
  prefilledFields?: {
    colegio?: boolean
    numeroColegiado?: boolean
  }
}

const SignupProfessionalInfoform = ({
  onValidityChange,
  prefilledFields,
}: Props) => {
  const form = useFormContext()

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        SignupProfessionalInfoSchema.safeParse(form.getValues()).success

      onValidityChange(computeValid())

      const subscription = form.watch(() => {
        onValidityChange(computeValid())
      })
      return () => subscription.unsubscribe()
    }
  }, [form, onValidityChange])

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-4">
        <CustomFormField
          name="colegio"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Nombre del colegio profesional"
          placeholder="Escoja el nombre del colegio profesional"
          fieldValues={COLEGIO_OPTIONS}
          readonly={prefilledFields?.colegio || false}
        />

        <CustomFormField
          name="numeroColegiado"
          fieldType={FormFieldType.INPUT}
          form={form}
          label="Número de colegiado"
          placeholder="Ingrese su número de colegiado"
          readonly={prefilledFields?.numeroColegiado || false}
        />
      </div>
    </Form>
  )
}

export default SignupProfessionalInfoform
