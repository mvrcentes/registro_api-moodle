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

// remove
const steps = [
  { label: "DPI" },
  { label: "Información de la cuenta" },
  { label: "Demografía" },
  { label: "Institución" },
  { label: "Información profesional" },
] satisfies StepConfig[]

export default function SignupWizard() {
  const [step1Valid, setStep1Valid] = useState(false)
  const [step2Valid, setStep2Valid] = useState(false)
  const [step3Valid, setStep3Valid] = useState(false)
  const [step4Valid, setStep4Valid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrefilling, setIsPrefilling] = useState(false)

  const {
    nextStep,
    prevStep,
    resetSteps,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  } = useStepper({ initialStep: 0, steps })

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
      fechaNacimiento: "",
      // Paso 2 (demografía)
      nit: "",
      sexo: "",
      departamento: "",
      municipio: "",
      telefono: "",
      // Paso 3 (institución)
      entidad: "",
      dependencia: "",
      renglon: "",
      // Paso 4 (colegiado)
      colegio: "",
      numeroColegiado: "",
    },
  })

  // Validación del paso 0 (DPI)
  const watchedDpi = methods.watch("dpi")
  const step0Valid = SignupPreFillSchema.safeParse({
    dpi: watchedDpi ?? "",
  }).success

  const handlePrefill = async () => {
    const dpi = methods.getValues("dpi")
    if (!dpi) return

    setIsPrefilling(true)
    try {
      const result = await prefill({ dpi })
      
      if (result.success && result.data) {
        // Prellenar los datos del formulario
        methods.setValue("primerNombre", result.data.primerNombre || "")
        methods.setValue("segundoNombre", result.data.segundoNombre || "")
        methods.setValue("primerApellido", result.data.primerApellido || "")
        methods.setValue("segundoApellido", result.data.segundoApellido || "")
        methods.setValue("email", result.data.email || "")
        methods.setValue("fechaNacimiento", result.data.fechaNacimiento || "")
        methods.setValue("sexo", result.data.sexo || "")
        methods.setValue("pais", result.data.pais || "")
        methods.setValue("departamento", result.data.departamento || "")
        methods.setValue("municipio", result.data.municipio || "")
        methods.setValue("nit", result.data.nit || "")
        methods.setValue("telefono", result.data.telefono || "")
        methods.setValue("entidad", result.data.entidad || "")
        methods.setValue("dependencia", result.data.dependencia || "")
        methods.setValue("renglon", result.data.renglon || "")
        methods.setValue("colegio", result.data.colegio || "")
        methods.setValue("numeroColegiado", result.data.numeroColegiado || "")

        toast.success("Información prellenada exitosamente")
        nextStep()
      } else {
        toast.error(result.error?.message || "Error al prellenar información")
      }
    } catch (error) {
      toast.error("Error al consultar DPI")
    } finally {
      setIsPrefilling(false)
    }
  }

  const handleSubmit = async (values: z.infer<typeof SignupAllSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signup(values)
      
      if (result.success) {
        toast.success("Usuario registrado exitosamente")
        resetSteps()
        methods.reset()
      } else {
        toast.error(result.error?.message || "Error al registrar usuario")
      }
    } catch (error) {
      toast.error("Error al registrar usuario")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Steps activeStep={activeStep}>
            <Step index={0} label="DPI">
              <SignupPreFillForm />
            </Step>

            <Step index={1} label="Datos de cuenta">
              <SignupCompleteForm onValidityChange={setStep1Valid} />
            </Step>

            <Step index={2} label="Demografía">
              <SignupDemographicsForm onValidityChange={setStep2Valid} />
            </Step>

            <Step index={3} label="Institución">
              <SignupInstitutionForm onValidityChange={setStep3Valid} />
            </Step>

            <Step index={4} label="Información profesional">
              <SignupProfessionalInfoform onValidityChange={setStep4Valid} />
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
            <Button onClick={resetSteps} variant="outline">
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
                {isPrefilling ? "Consultando..." : "Consultar DPI"}
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

            {activeStep === 4 && (
              <Button
                type="submit"
                disabled={!step4Valid || isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Usuario"}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}
