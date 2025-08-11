"use client"

import { useCallback, useMemo, useState } from "react"
import type { StepConfig } from "../stepper-types"

type UseStepperArgs = {
  initialStep?: number
  steps: StepConfig[]
}

export function useStepper({ initialStep = 0, steps }: UseStepperArgs) {
  const [activeStep, setActiveStep] = useState<number>(initialStep)

  const isCompleted = activeStep === steps.length
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === steps.length - 1
  const isOptionalStep = !isCompleted && (steps[activeStep]?.optional ?? false)
  const isDisabledStep = isFirstStep // para el botón "Prev" del demo

  const nextStep = useCallback(() => {
    setActiveStep((s) => (s < steps.length ? s + 1 : s))
  }, [steps.length])

  const prevStep = useCallback(() => {
    setActiveStep((s) => (s > 0 ? s - 1 : s))
  }, [])

  const setStep = useCallback(
    (index: number) => {
      if (index < 0) return
      // permitir ir a "completed" (index === steps.length)
      if (index <= steps.length) setActiveStep(index)
    },
    [steps.length]
  )

  const resetSteps = useCallback(() => {
    setActiveStep(0)
  }, [])

  return useMemo(
    () => ({
      // state
      activeStep,
      // derived
      isCompleted,
      isFirstStep,
      isLastStep,
      isOptionalStep,
      isDisabledStep,
      // actions
      nextStep,
      prevStep,
      setStep,
      resetSteps,
    }),
    [
      activeStep,
      isCompleted,
      isFirstStep,
      isLastStep,
      isOptionalStep,
      isDisabledStep,
      nextStep,
      prevStep,
      setStep,
      resetSteps,
    ]
  )
}

export type StepperApi = ReturnType<typeof useStepper>
