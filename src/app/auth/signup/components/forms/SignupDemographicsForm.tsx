"use client"

import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { SignupDemographicSchema } from "@/features/auth/schemas/auth.schema"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { SelectItem } from "@/components/ui/select"
import countries from "i18n-iso-countries"
import { allCountries } from "country-region-data"
import EsLocale from "i18n-iso-countries/langs/es.json"
import { State, City } from "country-state-city"
import { ETNIA_OPTIONS } from "./types"

// Tipos locales mínimos para country-region-data
type CRRegion = { name: string; shortCode?: string }
type CRCountry = {
  countryName: string
  countryShortCode: string
  regions: CRRegion[]
}

type Props = {
  onValidityChange?: (valid: boolean) => void
}

const SignupDemographicsForm = ({ onValidityChange }: Props) => {
  countries.registerLocale(EsLocale as any)

  const form = useFormContext()

  // Observa el país elegido en el paso 1
  const selectedCountryName: string | undefined = form.watch("pais")

  // #region Departamento
  // Si no hay país seleccionado, no hay código de país
  const countryCode =
    (selectedCountryName &&
      countries.getAlpha2Code(selectedCountryName, "es")) ||
    (selectedCountryName &&
      countries.getAlpha2Code(selectedCountryName, "en")) ||
    ""

  const collator = new Intl.Collator("es")

  // Soporte para ambas formas (objeto y tupla) de country-region-data
  type CRTupleRegion = [name: string, shortCode?: string]
  type CRTupleCountry = [
    countryName: string,
    countryShortCode: string,
    regions: CRTupleRegion[]
  ]
  type CRAnyCountry = CRCountry | CRTupleCountry

  const normalizeCountry = (c: CRAnyCountry): CRCountry => {
    if (Array.isArray(c)) {
      const [countryName, countryShortCode, regions] = c
      return {
        countryName,
        countryShortCode,
        regions: regions.map((r) =>
          Array.isArray(r) ? { name: r[0], shortCode: r[1] } : (r as any)
        ),
      }
    }
    return c
  }

  const rawCountries = allCountries as unknown as CRAnyCountry[]
  const countriesData: CRCountry[] = rawCountries.map(normalizeCountry)
  const entry = countriesData.find((c) => c.countryShortCode === countryCode)
  const regions = entry?.regions ?? []

  const deptoOptions = regions
    .map((r) => ({ value: r.name, label: r.name })) // o value: r.shortCode ?? r.name
    .sort((a, b) => collator.compare(a.label, b.label))

  // #endregion

  // #region Municipio

  const states = countryCode ? State.getStatesOfCountry(countryCode) : []

  const normalize = (s: string | undefined) =>
    (s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "") // quita acentos
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()

  const stripDescriptors = (s: string) =>
    s
      .replace(
        /\b(departamento|department|provincia|province|region|state|estado)\b/gi,
        ""
      )
      .replace(/\s+/g, " ")
      .trim()

  const normKey = (s: string | undefined) =>
    normalize(stripDescriptors(s || ""))

  const stateIndex = new Map<string, string>() // key -> isoCode
  for (const st of states) {
    const k1 = normKey(st.name) // ej. "guatemala"
    const k2 = normalize(st.name) // ej. "guatemala department"
    if (k1) stateIndex.set(k1, st.isoCode)
    if (k2 && k2 !== k1) stateIndex.set(k2, st.isoCode)
  }

  const selectedDeptoName: string | undefined = form.watch(
    "departamento_residencia"
  )

  const target = normKey(selectedDeptoName)

  // Match tolerante: 1) exacto, 2) includes en ambos sentidos
  let selectedStateCode: string | undefined = stateIndex.get(target)
  if (!selectedStateCode && target) {
    const hit = Array.from(stateIndex.entries()).find(
      ([k]) => k.includes(target) || target.includes(k)
    )
    selectedStateCode = hit?.[1]
  }

  const cityList =
    countryCode && selectedStateCode
      ? City.getCitiesOfState(countryCode, selectedStateCode)
      : []

  const municipioOptions = cityList
    .map((c) => ({ value: c.name, label: c.name }))
    .sort((a, b) => collator.compare(a.label, b.label))

  // #endregion

  // #region Celular
  const fmtGT = (s: string) => {
    const raw = (s ?? "").replace(/\D/g, "").slice(0, 8)
    return raw.length > 4 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw
  }

  useEffect(() => {
    const sub = form.watch((values, info) => {
      if (info.name === "celular") {
        const current = values.celular ?? ""
        const formatted = fmtGT(current)
        if (current !== formatted) {
          form.setValue("celular", formatted, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      }
    })
    return () => sub.unsubscribe()
  }, [form])

  // #endregion

  useEffect(() => {
    form.setValue("departamento_residencia", "")
    form.setValue("municipio_residencia", "")
  }, [selectedCountryName])

  // Si cambia el departamento, resetea municipio
  const selectedDepto = form.watch("departamento_residencia")
  useEffect(() => {
    form.setValue("municipio_residencia", "")
  }, [selectedDepto])

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        SignupDemographicSchema.safeParse(form.getValues()).success

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
          name="cui"
          fieldType={FormFieldType.TEXT}
          form={form}
          label="CUI"
          placeholder="Ingrese su CUI"
          readonly={true}
        />
        <CustomFormField
          name="nit"
          fieldType={FormFieldType.TEXT}
          form={form}
          label="NIT"
          placeholder="Ingrese su NIT"
        />
        <CustomFormField
          name="sexo"
          fieldType={FormFieldType.SELECT}
          form={form}
          label="Género"
          placeholder="Ingrese su género">
          <SelectItem value={"Masculino"}>Masculino</SelectItem>
          <SelectItem value={"Femenino"}>Femenino</SelectItem>
        </CustomFormField>
        <CustomFormField
          name="edad"
          fieldType={FormFieldType.NUMBER}
          form={form}
          label="Edad"
          placeholder="Ingrese su edad"
        />
        <CustomFormField
          name="departamento_residencia"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Departamento de Residencia"
          placeholder={
            countryCode
              ? "Seleccione su departamento"
              : "Seleccione un país primero"
          }
          fieldValues={deptoOptions}
        />
        <CustomFormField
          name="municipio_residencia"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Municipio de Residencia"
          placeholder={
            selectedStateCode
              ? "Seleccione su municipio"
              : selectedDeptoName
              ? "Cargando municipios…"
              : "Seleccione un departamento primero"
          }
          fieldValues={municipioOptions}
        />
        <CustomFormField
          name="etnia"
          fieldType={FormFieldType.SELECT_ITEM}
          form={form}
          label="Etnia"
          placeholder="Seleccione su etnia"
          fieldValues={ETNIA_OPTIONS}
        />
        <CustomFormField
          name="celular"
          fieldType={FormFieldType.TEXT}
          form={form}
          label="Número de Celular"
          placeholder="Ingrese su número de celular"
        />
      </div>
    </Form>
  )
}

export default SignupDemographicsForm
