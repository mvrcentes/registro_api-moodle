"use client"

import React, { useEffect } from "react"
import CustomFormField from "@/components/reusable/CustomFormField"
import { Form } from "@/components/ui/form"
import { FormFieldType } from "@/lib/types"
import { useFormContext } from "react-hook-form"
import {
  INSTITUCION_OPTIONS,
  RENGLON_OPTIONS,
  ENTIDAD_OPTIONS,
  DEPENDENCIA_OPTIONS,
} from "./types"
import { SignupInstitutionSchema } from "@/features/auth/schemas/auth.schema"

type Props = {
  onValidityChange?: (valid: boolean) => void
  prefilledFields?: {
    entidad?: boolean
    institucion?: boolean
    dependencia?: boolean
    renglon?: boolean
  }
}

const SignupInstitutionForm = ({
  onValidityChange,
  prefilledFields,
}: Props) => {
  const form = useFormContext()

  const selectedSector: String | undefined = form.watch("entidad")

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        SignupInstitutionSchema.safeParse(form.getValues()).success

      // Initial validity check
      onValidityChange(computeValid())

      const subscription = form.watch(() => {
        onValidityChange(computeValid())
      })

      return () => subscription.unsubscribe()
    }
  }, [form, onValidityChange])

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-4">
        <CustomFormField
          name="entidad"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Entidad"
          placeholder="Seleccione la entidad a la que pertenece"
          fieldValues={ENTIDAD_OPTIONS}
          readonly={prefilledFields?.entidad || false}
        />

        <CustomFormField
          name="institucion"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Institución"
          placeholder="Seleccione la institución a la que pertenece"
          fieldValues={INSTITUCION_OPTIONS}
          readonly={prefilledFields?.institucion || false}
        />

        {selectedSector === "CONTRALORÍA GENERAL DE CUENTAS" && (
          <CustomFormField
            name="dependencia"
            fieldType={FormFieldType.SELECT_ITEM}
            form={form}
            label="Ubicación Administrativa"
            placeholder="Seleccione la ubicación administrativa"
            fieldValues={DEPENDENCIA_OPTIONS}
          />
        )}

        <CustomFormField
          name="renglon"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Renglón Presupuestario"
          placeholder="Seleccione el renglón presupuestario"
          fieldValues={RENGLON_OPTIONS}
          readonly={prefilledFields?.renglon || false}
        />
      </div>
    </Form>
  )
}

export default SignupInstitutionForm
