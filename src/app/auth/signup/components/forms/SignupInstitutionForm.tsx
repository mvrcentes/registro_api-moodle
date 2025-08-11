"use client"

import React, { useEffect } from "react"
import CustomFormField from "@/components/reusable/CustomFormField"
import { Form } from "@/components/ui/form"
import { FormFieldType } from "@/lib/types"
import { useFormContext } from "react-hook-form"
import {
  INSTITUCION_OPTIONS,
  RENGLON_OPTIONS,
  SECTOR_OPTIONS,
  UBICACION_CGC_OPTIONS,
} from "./types"

type Props = {
  onValidityChange?: (valid: boolean) => void
}

const SignupInstitutionForm = ({ onValidityChange }: Props) => {
  const form = useFormContext()

  const selectedSector: String | undefined = form.watch("sector")

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        form.getValues("sector") && form.getValues("institucion")

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
      <div className="grid grid-cols-2 gap-4 space-y-4">
        <CustomFormField
          name="sector"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Sector"
          placeholder="Seleccione el sector al que pertenece"
          fieldValues={SECTOR_OPTIONS}
        />

        <CustomFormField
          name="institucion"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Institución"
          placeholder="Seleccione la institución a la que pertenece"
          fieldValues={INSTITUCION_OPTIONS}
        />

        {selectedSector === "CGC" && (
          <CustomFormField
            name="ubicacionAdministrativa"
            fieldType={FormFieldType.SELECT_ITEM}
            form={form}
            label="Ubicación Administrativa"
            placeholder="Seleccione la ubicación administrativa"
            fieldValues={UBICACION_CGC_OPTIONS}
          />
        )}

        <CustomFormField
          name="renglon_presupuestario"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Renglón Presupuestario"
          placeholder="Seleccione el renglón presupuestario"
          fieldValues={RENGLON_OPTIONS}
        />
      </div>
    </Form>
  )
}

export default SignupInstitutionForm
