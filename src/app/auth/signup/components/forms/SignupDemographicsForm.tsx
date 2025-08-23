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
  prefilledFields?: {
    cui?: boolean
    edad?: boolean
    sexo?: boolean
    departamento_residencia?: boolean
    municipio_residencia?: boolean
    nit?: boolean
    telefono?: boolean
  }
}

const SignupDemographicsForm = ({
  onValidityChange,
  prefilledFields = {},
}: Props) => {
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

  // #region telefono
  const fmtGT = (s: string) => {
    const raw = (s ?? "").replace(/\D/g, "").slice(0, 8)
    return raw.length > 4 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw
  }

  useEffect(() => {
    const sub = form.watch((values, info) => {
      if (info.name === "telefono") {
        const current = values.telefono ?? ""
        const formatted = fmtGT(current)
        if (current !== formatted) {
          form.setValue("telefono", formatted, {
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
          control={form.control}
          name="cui"
          fieldType={FormFieldType.INPUT}
          label="CUI"
          placeholder="Ingrese su CUI"
          readonly={prefilledFields.cui || false}
          description={
            prefilledFields.cui
              ? "Este campo se llenó automáticamente con el DPI consultado"
              : undefined
          }
        />
        <CustomFormField
          control={form.control}
          name="nit"
          fieldType={FormFieldType.INPUT}
          label="NIT"
          placeholder="Ingrese su NIT"
          readonly={prefilledFields.nit || false}
        />
        <CustomFormField
          control={form.control}
          name="sexo"
          fieldType={FormFieldType.SELECT}
          label="Género"
          placeholder="Seleccione su género"
          readonly={prefilledFields.sexo || false}>
          <SelectItem value={"MASCULINO"}>Masculino</SelectItem>
          <SelectItem value={"FEMENINO"}>Femenino</SelectItem>
        </CustomFormField>
        <CustomFormField
          control={form.control}
          name="edad"
          fieldType={FormFieldType.NUMERIC_ONLY}
          label="Edad"
          placeholder="Ingrese su edad"
          readonly={prefilledFields.edad || false}
          description={
            prefilledFields.edad
              ? "Calculada automáticamente desde la fecha de nacimiento"
              : undefined
          }
        />
        <CustomFormField
          control={form.control}
          name="departamento_residencia"
          fieldType={FormFieldType.SELECT_ITEM}
          label="Departamento de Residencia"
          placeholder={
            countryCode
              ? "Seleccione su departamento"
              : "Seleccione un país primero"
          }
          fieldValues={deptoOptions}
          readonly={prefilledFields.departamento_residencia || false}
        />
        <CustomFormField
          control={form.control}
          name="municipio_residencia"
          fieldType={FormFieldType.SELECT_ITEM}
          label="Municipio de Residencia"
          placeholder={
            selectedStateCode
              ? "Seleccione su municipio"
              : selectedDeptoName
              ? "Cargando municipios…"
              : "Seleccione un departamento primero"
          }
          fieldValues={municipioOptions}
          readonly={prefilledFields.municipio_residencia || false}
        />
        <CustomFormField
          control={form.control}
          name="etnia"
          fieldType={FormFieldType.SELECT_ITEM}
          label="Etnia"
          placeholder="Seleccione su etnia"
          fieldValues={ETNIA_OPTIONS}
        />
        <CustomFormField
          control={form.control}
          name="telefono"
          fieldType={FormFieldType.INPUT}
          label="Número de Teléfono"
          placeholder="Ingrese su número de teléfono"
          readonly={prefilledFields.telefono || false}
        />
      </div>
    </Form>
  )
}

export default SignupDemographicsForm
