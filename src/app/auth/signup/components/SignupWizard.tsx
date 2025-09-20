"use client"

import { useState } from "react"
import { StepConfig } from "@/components/reusable/step/stepper-types"
import { useStepper } from "@/components/reusable/step/hooks/use-stepper"
import { Step, Steps } from "@/components/reusable/step/stepper"
import { Button } from "@/components/ui/button"
import SignupPreFillForm from "./forms/SignupPreFillForm"
import SignupCompleteForm from "./forms/SignupCompleteForm"
import SignupDemographicsForm from "./forms/SignupDemographicsForm"
import SignupInstitutionForm from "./forms/SignupInstitutionForm"
import SignupFilesForm from "./forms/6_SignupFilesForm"
import { z } from "zod"
import {
  SignupPreFillSchema,
  SignupAllSchema,
} from "@/features/auth/schemas/auth.schema"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import SignupProfessionalInfoform from "./forms/SignupProfessionalInfoform"
import { prefill, signup } from "@/features/auth/api/auth.client"
import { toast } from "sonner"
import { mapColegioApiToValue } from "@/lib/utils"

// remove
const steps = [
  { label: "DPI" },
  { label: "Cuenta" },
  { label: "Perfil" },
  { label: "Institución" },
  { label: "Profesional" },
  { label: "Archivos" },
] satisfies StepConfig[]

export default function SignupWizard() {
  const [step1Valid, setStep1Valid] = useState(false)
  const [step2Valid, setStep2Valid] = useState(false)
  const [step3Valid, setStep3Valid] = useState(false)
  const [step4Valid, setStep4Valid] = useState(false)
  const [step5Valid, setStep5Valid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrefilling, setIsPrefilling] = useState(false)
  const [isPrefilled, setIsPrefilled] = useState(false)
  const [prefilledFields, setPrefilledFields] = useState<{
    nombres?: boolean
    apellidos?: boolean
    email?: boolean
    pais?: boolean
    ciudad?: boolean
    cui?: boolean
    edad?: boolean
    sexo?: boolean
    departamento_residencia?: boolean
    municipio_residencia?: boolean
    nit?: boolean
    telfono?: boolean
    // paso 3 - Información Institucional
    entidad?: boolean
    institucion?: boolean
    dependencia?: boolean
    renglon?: boolean
    // paso 4 - Información Profesional
    colegio?: boolean
    numeroColegiado?: boolean
    // paso 5 - Archivos
    pdf_dpi?: File
    pdf_contrato?: File
    pdf_certificado_profesional?: File
  }>({})

  const {
    nextStep,
    prevStep,
    resetSteps,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  } = useStepper({ initialStep: 5, steps })

  const methods = useForm<z.input<typeof SignupAllSchema>>({
    resolver: zodResolver(SignupAllSchema),
    mode: "onChange",
    defaultValues: {
      // Paso 0 (DPI)
      dpi: "",
      // Paso 1 (cuenta)
      email: "",
      confirm_email: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      password: "",
      confirm_password: "",
      pais: "",
      ciudad: "",
      // Paso 2 (demografía)
      cui: "",
      nit: "",
      sexo: "",
      edad: undefined,
      departamento_residencia: "",
      municipio_residencia: "",
      telefono: "",
      // Paso 3 (institución)
      entidad: "",
      institucion: "",
      dependencia: "",
      renglon: "",
      // Paso 4 (colegiado)
      colegio: "",
      numeroColegiado: "",
      // Paso 5 (archivos)
      pdf_dpi: undefined,
      pdf_contrato: undefined,
      pdf_certificado_profesional: undefined,
    },
  })

  // Validación del paso 0 (DPI)
  const watchedDpi = methods.watch("dpi")
  const step0Valid = SignupPreFillSchema.safeParse({
    dpi: watchedDpi ?? "",
  }).success

  // Función para calcular la edad desde la fecha de nacimiento
  const calculateAge = (birthDate: string): number | undefined => {
    if (!birthDate) return undefined

    // Intentar varios formatos de fecha
    let date: Date | null = null

    // Formato DD-MM-YYYY
    if (birthDate.includes("-") && birthDate.length === 10) {
      const [day, month, year] = birthDate.split("-")
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    // Formato DD/MM/YYYY
    else if (birthDate.includes("/") && birthDate.length === 10) {
      const [day, month, year] = birthDate.split("/")
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    // Formato YYYY-MM-DD
    else if (birthDate.includes("-") && birthDate.indexOf("-") === 4) {
      date = new Date(birthDate)
    }

    if (!date || isNaN(date.getTime())) return undefined

    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--
    }

    return age >= 0 ? age : undefined
  }

  // const handlePrefill = async () => {
  //   const dpi = methods.getValues("dpi")
  //   if (!dpi) return

  //   setIsPrefilling(true)
  //   try {
  //     const result = await prefill({ dpi })

  //     if (result.success && result.data) {
  //       // Verificar si hay datos reales
  //       const userData = result.data
  //       const hasData = Object.values(userData).some(
  //         (value) =>
  //           value &&
  //           value !== "" &&
  //           value !== userData.dpi &&
  //           value !== "Guatemala"
  //       )

  //       // Calcular edad si hay fecha de nacimiento
  //       const edad = calculateAge(userData.fechaNacimiento || "")

  //       // Prellenar los datos del formulario
  //       methods.setValue("primerNombre", userData.primerNombre || "")
  //       methods.setValue("segundoNombre", userData.segundoNombre || "")
  //       methods.setValue("primerApellido", userData.primerApellido || "")
  //       methods.setValue("segundoApellido", userData.segundoApellido || "")
  //       methods.setValue("email", userData.email || "")
  //       methods.setValue("confirm_email", userData.email || "") // Confirmar email igual al email
  //       methods.setValue("pais", userData.pais || "")
  //       methods.setValue("ciudad", userData.municipio || "")

  //       // Demografía
  //       methods.setValue("cui", userData.dpi) // CUI es el mismo DPI
  //       methods.setValue("sexo", userData.sexo || "")
  //       if (edad !== undefined) {
  //         methods.setValue("edad", edad)
  //       }

  //       // Primero establecer el departamento
  //       if (userData.departamento) {
  //         methods.setValue("departamento_residencia", userData.departamento)

  //         // Esperar un tick para que el formulario procese el departamento
  //         // y luego establecer el municipio
  //         setTimeout(() => {
  //           if (userData.municipio) {
  //             methods.setValue("municipio_residencia", userData.municipio)
  //           }
  //         }, 100)
  //       }

  //       methods.setValue("nit", userData.nit || "")
  //       methods.setValue("telefono", userData.telefono || "")

  //       // Paso 4 - Información Institucional
  //       methods.setValue("entidad", userData.entidad || "")
  //       methods.setValue("dependencia", userData.dependencia || "")
  //       methods.setValue("renglon", userData.renglon || "")

  //       // Paso 5 - Información Profesional
  //       const mappedColegio = mapColegioApiToValue(userData.colegio)
  //       methods.setValue("colegio", mappedColegio ?? "NO APLICA")
  //       methods.setValue("numeroColegiado", userData.numeroColegiado || "")

  //       // Crear objeto con información de qué campos fueron prellenados
  //       // Solo marcar como readonly los campos que realmente tienen datos
  //       const fieldsInfo = {
  //         primerNombre: !!userData.primerNombre,
  //         segundoNombre: !!userData.segundoNombre,
  //         primerApellido: !!userData.primerApellido,
  //         segundoApellido: !!userData.segundoApellido,
  //         email: !!userData.email,
  //         confirm_email: !!userData.email, // Confirmación de email también readonly si hay email
  //         pais: !!userData.pais,
  //         ciudad: !!userData.municipio,
  //         cui: true, // CUI siempre se prellena con el DPI
  //         edad: edad !== undefined,
  //         sexo: !!userData.sexo,
  //         departamento_residencia: false, // Siempre editable
  //         municipio_residencia: false, // Siempre editable
  //         nit: !!userData.nit,
  //         telefono: false, // Teléfono siempre editable

  //         // paso 5 - Información Institucional
  //         colegio: !!userData.colegio,
  //         numeroColegiado: !!userData.numeroColegiado,
  //       }

  //       setPrefilledFields(fieldsInfo)
  //       setIsPrefilled(hasData) // Solo marcar como prellenado si hay datos reales

  //       if (hasData) {
  //         toast.success("Información prellenada exitosamente")
  //       } else {
  //         toast.info("DPI consultado - complete todos los campos manualmente")
  //       }
  //       nextStep()
  //     } else {
  //       console.error("Error en la respuesta:", result.error)
  //       toast.error(result.error?.message || "Error al prellenar información")
  //       // Avanzar al siguiente paso incluso si hay error en la consulta
  //       nextStep()
  //     }
  //   } catch (error) {
  //     console.error("Error en handlePrefill:", error)
  //     toast.error("Error al consultar DPI")
  //     // Avanzar al siguiente paso incluso si hay error
  //     nextStep()
  //   } finally {
  //     setIsPrefilling(false)
  //   }
  // }

  const handlePrefill = async () => {
    setIsPrefilling(true)
    try {
      // MOCK: sin llamada a API, avanzamos al siguiente paso
      const dpi = methods.getValues("dpi")
      console.log("[MOCK] Prefill con DPI:", dpi)
      nextStep()
    } finally {
      setIsPrefilling(false)
    }
  }

  const handleSubmit = async (values: z.infer<typeof SignupAllSchema>) => {
    setIsSubmitting(true)
    try {
      // MOCK: sin llamada a API. Imprimimos valores para verificar archivos.
      const vals = values
      console.log("[MOCK] SUBMIT values:", vals)
      console.log("[MOCK] Archivos:", {
        pdf_dpi: vals.pdf_dpi ? (vals.pdf_dpi as File).name : null,
        pdf_contrato: vals.pdf_contrato
          ? (vals.pdf_contrato as File).name
          : null,
        pdf_certificado_profesional: vals.pdf_certificado_profesional
          ? (vals.pdf_certificado_profesional as File).name
          : null,
      })
      toast.success("Formulario listo (mock). Revisa la consola.")
      resetSteps()
      setIsPrefilled(false)
      setPrefilledFields({})
      methods.reset()
    } catch (error) {
      console.error(error)
      toast.error("Error inesperado (mock)")
    } finally {
      setIsSubmitting(false)
    }
    // setIsSubmitting(true)
    // try {
    //   const result = await signup(values)

    //   if (result.success) {
    //     toast.success("Usuario registrado exitosamente")
    //     resetSteps()
    //     setIsPrefilled(false)
    //     setPrefilledFields({})
    //     methods.reset()
    //   } else {
    //     toast.error(result.error?.message || "Error al registrar usuario")
    //   }
    // } catch (error) {
    //   toast.error("Error al registrar usuario")
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  return (
    <>
      <FormProvider {...methods}>
        {/* <form onSubmit={methods.handleSubmit(handleSubmit)}> */}
        <form
          id="signup-form"
          onSubmit={methods.handleSubmit(handleSubmit, (errors) => {
            // Se ejecuta SI la validación (SignupAllSchema) falla
            const vals = methods.getValues()
            console.log(
              "[MOCK] INVALID submit — printing current values anyway:",
              vals
            )
            console.log("[MOCK] Zod errors:", errors)
          })}>
          <Steps activeStep={activeStep}>
            <Step index={0} label="DPI">
              <SignupPreFillForm isPrefilled={isPrefilled} />
            </Step>

            <Step index={1} label="Cuenta">
              <SignupCompleteForm
                onValidityChange={setStep1Valid}
                isPrefilled={isPrefilled}
                prefilledFields={prefilledFields}
              />
            </Step>

            <Step index={2} label="Perfil">
              <SignupDemographicsForm
                onValidityChange={setStep2Valid}
                prefilledFields={prefilledFields}
              />
            </Step>

            <Step index={3} label="Institución">
              <SignupInstitutionForm onValidityChange={setStep3Valid} />
            </Step>

            <Step index={4} label="Profesional">
              <SignupProfessionalInfoform
                onValidityChange={setStep4Valid}
                prefilledFields={prefilledFields}
              />
            </Step>
            <Step index={5} label="Archivos">
              <SignupFilesForm onValidityChange={setStep5Valid} />
            </Step>
          </Steps>
        </form>
      </FormProvider>

      <div className="mt-4 flex items-center justify-end gap-2">
        {/* Estado de "completado" que muestra tu stepper cuando ya se avanzó más allá del último */}
        {activeStep === steps.length ? (
          <>
            <h2 className="mr-auto text-sm font-medium">
              ¡Todos los pasos completados!
            </h2>
            <Button
              onClick={() => {
                resetSteps()
                setIsPrefilled(false)
                setPrefilledFields({})
              }}
              variant="outline">
              Reiniciar
            </Button>
          </>
        ) : (
          <>
            {/* Atrás */}
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              variant="secondary">
              Anterior
            </Button>

            {/* Avanzar / Terminar por paso */}
            {activeStep === 0 && (
              <Button
                onClick={handlePrefill}
                disabled={!step0Valid || isPrefilling}>
                {isPrefilling ? "Consultando..." : "Siguiente"}
              </Button>
            )}

            {activeStep === 1 && (
              <Button
                onClick={() => {
                  if (!step1Valid) return
                  nextStep()
                }}
                disabled={!step1Valid}>
                Siguiente
              </Button>
            )}

            {activeStep === 2 && (
              <Button
                onClick={() => {
                  if (!step2Valid) return
                  nextStep()
                }}
                disabled={!step2Valid}>
                Siguiente
              </Button>
            )}

            {activeStep === 3 && (
              <Button
                onClick={() => {
                  if (!step3Valid) return
                  nextStep()
                }}
                disabled={!step3Valid}>
                Siguiente
              </Button>
            )}

            {activeStep === 5 && (
              // <Button type="submit" disabled={!step5Valid || isSubmitting}>
              <Button
                type="submit"
                form="signup-form"
                disabled={!step5Valid || isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Usuario"}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}
