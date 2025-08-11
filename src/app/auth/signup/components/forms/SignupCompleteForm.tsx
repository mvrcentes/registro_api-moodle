"use client"
import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { Form } from "@/components/ui/form"
import { FormFieldType } from "@/lib/types"
import EsLocale from "i18n-iso-countries/langs/es.json"
import countries from "i18n-iso-countries"
import { SignupCompleteSchema } from "@/features/auth/schemas/auth.schema"

type Props = {
  onValidityChange?: (valid: boolean) => void
}

export default function SignupCompleteForm({ onValidityChange }: Props) {
  const form = useFormContext()

  // Registrar el locale ES para i18n-iso-countries
  countries.registerLocale(EsLocale as any)

  const collator = new Intl.Collator("es")
  const countryOptions = Object.values(
    countries.getNames("es") as Record<string, string>
  )
    .sort((a, b) => collator.compare(a, b))
    .map((name) => ({ value: name, label: name }))

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        SignupCompleteSchema.safeParse(form.getValues()).success

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
          className="col-span-2"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="usuario"
          label="Usuario"
          readonly={true}
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          placeholder="Ingrese su correo"
          name="email"
          label="Email"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          placeholder="Confirme su correo"
          name="confirm_email"
          label="Confirmación de correo"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          placeholder="Ingrese su nombres"
          name="nombre"
          label="Nombres"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          placeholder="Ingrese sus apellidos"
          name="apellido"
          label="Apellidos"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PASSWORD}
          placeholder="Ingrese su contraseña"
          name="password"
          label="Contraseña"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PASSWORD}
          placeholder="Confirme su contraseña"
          name="confirm_password"
          label="Confirmación de contraseña"
        />

        <CustomFormField
          form={form}
          control={form.control}
          fieldType={FormFieldType.SELECT_ITEM}
          placeholder="Seleccione su país"
          name="pais"
          label="País"
          fieldValues={countryOptions}
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          placeholder="Ingrese su ciudad"
          name="ciudad"
          label="Ciudad"
        />
      </div>
    </Form>
  )
}
