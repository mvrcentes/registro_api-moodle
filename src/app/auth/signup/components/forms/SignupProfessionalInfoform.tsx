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
    profesion?: boolean
    puesto?: boolean
    sector?: boolean
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
      const computeValid = () => {
        // Solo validar los campos específicos de este paso
        const allValues = form.getValues()
        const step4Values = {
          profesion: allValues.profesion,
          puesto: allValues.puesto,
          sector: allValues.sector,
          colegio: allValues.colegio,
          numeroColegiado: allValues.numeroColegiado,
        }
        const result = SignupProfessionalInfoSchema.safeParse(step4Values)
        console.log("[SignupProfessionalInfo] Validation:", {
          step4Values,
          success: result.success,
          errors: result.success ? null : result.error.flatten()
        })
        return result.success
      }

      onValidityChange(computeValid())

      const subscription = form.watch(() => {
        onValidityChange(computeValid())
      })
      return () => subscription.unsubscribe()
    }
  }, [form, onValidityChange])

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomFormField
          name="profesion"
          fieldType={FormFieldType.INPUT}
          form={form}
          label="Profesión"
          placeholder="Ingrese su profesión"
          readonly={prefilledFields?.profesion || false}
        />

        <CustomFormField
          name="puesto"
          fieldType={FormFieldType.INPUT}
          form={form}
          label="Puesto"
          placeholder="Ingrese su puesto laboral"
          readonly={prefilledFields?.puesto || false}
        />

        <CustomFormField
          name="sector"
          fieldType={FormFieldType.INPUT}
          form={form}
          label="Sector"
          placeholder="Sector (Público/Privado)"
          readonly={prefilledFields?.sector || false}
        />

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
