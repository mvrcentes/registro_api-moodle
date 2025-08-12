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
    celular?: boolean
  }>({})

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
      nombres: "",
      apellidos: "",
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
      celular: "",
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

  // Función para calcular la edad desde la fecha de nacimiento
  const calculateAge = (birthDate: string): number | undefined => {
    if (!birthDate) return undefined
    
    // Intentar varios formatos de fecha
    let date: Date | null = null
    
    // Formato DD-MM-YYYY
    if (birthDate.includes('-') && birthDate.length === 10) {
      const [day, month, year] = birthDate.split('-')
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    // Formato DD/MM/YYYY
    else if (birthDate.includes('/') && birthDate.length === 10) {
      const [day, month, year] = birthDate.split('/')
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    // Formato YYYY-MM-DD
    else if (birthDate.includes('-') && birthDate.indexOf('-') === 4) {
      date = new Date(birthDate)
    }
    
    if (!date || isNaN(date.getTime())) return undefined
    
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--
    }
    
    return age >= 0 ? age : undefined
  }

  const handlePrefill = async () => {
    const dpi = methods.getValues("dpi")
    if (!dpi) return

    setIsPrefilling(true)
    try {
      console.log("Consultando DPI:", dpi)
      const result = await prefill({ dpi })
      console.log("Resultado del API:", result)
      
      if (result.success && result.data) {
        console.log("Datos recibidos del API completos:", JSON.stringify(result.data, null, 2))
        
                // Verificar si hay datos reales
        const hasData = Object.values(result.data).some(value => 
          value && value !== '' && value !== result.data.dpi && value !== 'Guatemala'
        )
        
        console.log("¿Tiene datos reales?:", hasData)

        // Combinar nombres y apellidos
        const nombresCompletos = [
          result.data.primerNombre || "",
          result.data.segundoNombre || ""
        ].filter(Boolean).join(" ")

        const apellidosCompletos = [
          result.data.primerApellido || "",
          result.data.segundoApellido || ""
        ].filter(Boolean).join(" ")

        // Calcular edad si hay fecha de nacimiento
        const edad = calculateAge(result.data.fechaNacimiento || "")
        
        // Prellenar los datos del formulario
        methods.setValue("nombres", nombresCompletos)
        methods.setValue("apellidos", apellidosCompletos)
        methods.setValue("email", result.data.email || "")
        methods.setValue("confirm_email", result.data.email || "") // Confirmar email igual al email
        methods.setValue("pais", result.data.pais || "")
        methods.setValue("ciudad", result.data.municipio || result.data.ciudad || "")
        
        // Demografía
        methods.setValue("cui", result.data.dpi) // CUI es el mismo DPI
        methods.setValue("sexo", result.data.sexo || "")
        if (edad !== undefined) {
          methods.setValue("edad", edad)
        }
        
        // Para departamento y municipio, usar mapeo secuencial
        console.log("Departamento del API:", result.data.departamento)
        console.log("Municipio del API:", result.data.municipio)
        
        // Primero establecer el departamento
        if (result.data.departamento) {
          methods.setValue("departamento_residencia", result.data.departamento)
          
          // Esperar un tick para que el formulario procese el departamento
          // y luego establecer el municipio
          setTimeout(() => {
            if (result.data.municipio) {
              console.log("Estableciendo municipio después del departamento:", result.data.municipio)
              methods.setValue("municipio_residencia", result.data.municipio)
            }
          }, 100)
        }
        
        methods.setValue("nit", result.data.nit || "")
        methods.setValue("celular", result.data.telefono || "")
        
        // Institución
        methods.setValue("entidad", result.data.entidad || "")
        methods.setValue("dependencia", result.data.dependencia || "")
        methods.setValue("renglon", result.data.renglon || "")
        
        // Profesional
        methods.setValue("colegio", result.data.colegio || "")
        methods.setValue("numeroColegiado", result.data.numeroColegiado || "")

        console.log("Valores después del setValue:", methods.getValues())
        
        // Crear objeto con información de qué campos fueron prellenados
        // Solo marcar como readonly los campos que realmente tienen datos
        const fieldsInfo = {
          nombres: !!nombresCompletos,
          apellidos: !!apellidosCompletos,
          email: !!(result.data.email),
          confirm_email: !!(result.data.email), // Confirmación de email también readonly si hay email
          pais: !!(result.data.pais),
          ciudad: !!(result.data.municipio || result.data.ciudad),
          cui: true, // CUI siempre se prellena con el DPI
          edad: edad !== undefined,
          sexo: !!(result.data.sexo),
          departamento_residencia: false, // Siempre editable
          municipio_residencia: false, // Siempre editable
          nit: !!(result.data.nit),
          celular: false // Celular siempre editable
        }
        
        setPrefilledFields(fieldsInfo)
        setIsPrefilled(hasData) // Solo marcar como prellenado si hay datos reales
        
        if (hasData) {
          toast.success("Información prellenada exitosamente")
        } else {
          toast.info("DPI consultado - complete todos los campos manualmente")
        }
        nextStep()
      } else {
        console.error("Error en la respuesta:", result.error)
        toast.error(result.error?.message || "Error al prellenar información")
        // Avanzar al siguiente paso incluso si hay error en la consulta
        nextStep()
      }
    } catch (error) {
      console.error("Error en handlePrefill:", error)
      toast.error("Error al consultar DPI")
      // Avanzar al siguiente paso incluso si hay error
      nextStep()
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
        setIsPrefilled(false)
        setPrefilledFields({})
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
              <SignupPreFillForm isPrefilled={isPrefilled} />
            </Step>

            <Step index={1} label="Datos de cuenta">
              <SignupCompleteForm 
                onValidityChange={setStep1Valid} 
                isPrefilled={isPrefilled}
                prefilledFields={prefilledFields}
              />
            </Step>

            <Step index={2} label="Demografía">
              <SignupDemographicsForm 
                onValidityChange={setStep2Valid}
                prefilledFields={prefilledFields}
              />
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
            <Button onClick={() => {
              resetSteps()
              setIsPrefilled(false)
              setPrefilledFields({})
            }} variant="outline">
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
