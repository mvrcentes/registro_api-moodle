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

// remove
const steps = [
  { label: "CUI" },
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
      // Paso 0 (CUI)
      cui: "",
      // Paso 1 (cuenta)
      usuario: "",
      email: "",
      confirm_email: "",
      nombre: "",
      apellido: "",
      password: "",
      confirm_password: "",
      pais: "",
      ciudad: "",
      // Paso 2 (demografía)
      nit: "",
      sexo: "",
      edad: "" as any,
      departamento_residencia: "",
      municipio_residencia: "",
      etnia: "",
      celular: "",
      // Paso 3 (institución)
      sector: "",
      institucion: "",
      ubicacionAdministrativa: "",
      renglon_presupuestario: "",
      // Paso 4 (colegiado)
      nombre_colegio_profesional: "",
      numero_colegiado: "",
    },
  })

  // Validación del paso 0 (CUI)
  const watchedCui = methods.watch("cui")
  const step0Valid = SignupPreFillSchema.safeParse({
    cui: watchedCui ?? "",
  }).success

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((values) => {
            console.log("Payload final:", values)
            // TODO: submit real
          })}>
          <Steps activeStep={activeStep}>
            <Step index={0} label="CUI">
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
              <SignupProfessionalInfoform onValidityChange={setStep3Valid} />
            </Step>
          </Steps>
        </form>
      </FormProvider>

      <div className="mt-4 flex items-center justify-end gap-2">
        {/* Estado de \"completado\" que muestra tu stepper cuando ya se avanzó más allá del último */}
        {activeStep === steps.length ? (
          <>
            <h2 className="mr-auto text-sm font-medium">
              All steps completed!
            </h2>
            <Button onClick={resetSteps} variant="outline">
              Reset
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
                onClick={() => {
                  if (!step0Valid) return
                  const cui = methods.getValues("cui") ?? ""
                  methods.setValue("usuario", cui, { shouldValidate: true })
                  nextStep()
                }}
                disabled={!step0Valid}>
                Siguiente
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
          </>
        )}
      </div>
    </>
  )
}
