"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StepConfig } from "./stepper-types"

type StepsProps = {
  activeStep: number
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

type StepProps = StepConfig & {
  index: number
  children?: React.ReactNode
}

const StepperContext = React.createContext<{ activeStep: number } | null>(null)

export function Steps({ activeStep, children, className, contentClassName }: StepsProps) {
  const items = React.Children.toArray(children) as React.ReactElement<StepProps>[]
  const total = items.length

  return (
    <StepperContext.Provider value={{ activeStep }}>
      <div
        className={cn(
          "rounded-lg border p-4 md:p-6 flex w-full flex-col gap-4",
          className
        )}
      >
        <ol className="flex items-center gap-2 shrink-0">
          {items.map((child, i) => {
            const { label, optional } = child.props
            const status =
              activeStep > i
                ? "complete"
                : activeStep === i
                ? "current"
                : "upcoming"

            return (
              <React.Fragment key={`header-${i}`}>
                <li className="flex items-center gap-2">
                  <StepBadge index={i} status={status} />
                  <div className="text-sm">
                    <span className="font-medium">{label}</span>{" "}
                    {optional && (
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    )}
                  </div>
                </li>
                {i < total - 1 && (
                  <div
                    aria-hidden
                    className={cn(
                      "mx-2 hidden h-0.5 flex-1 rounded-full md:block",
                      status === "complete"
                        ? "bg-[#3296cf]"
                        : "bg-gray-200"
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </ol>

        <div className={cn("flex-1 overflow-y-auto", contentClassName)}>
          {activeStep < total ? (
            items.map((child, i) =>
              i === activeStep ? (
                <div
                  key={`content-${i}`}
                  className="rounded-md bg-muted/60 p-4">
                  {child.props.children}
                </div>
              ) : null
            )
          ) : (
            <div className="rounded-md bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">
                All steps completed.
              </p>
            </div>
          )}
        </div>
      </div>
    </StepperContext.Provider>
  )
}

function StepBadge({
  index,
  status,
}: {
  index: number
  status: "complete" | "current" | "upcoming"
}) {
  const base =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium"
  if (status === "complete") {
    return (
      <span
        className={cn(base, "border-[#3296cf] bg-[#3296cf] text-white shadow-md")}>
        <Check className="h-4 w-4" />
      </span>
    )
  }
  if (status === "current") {
    return (
      <span
        className={cn(base, "border-[#3296cf] bg-[#3296cf] text-white shadow-md")}>
        {index + 1}
      </span>
    )
  }
  return (
    <span
      className={cn(base, "border-gray-300 bg-white text-gray-500")}>
      {index + 1}
    </span>
  )
}

export function Step(_props: StepProps) {
  const ctx = React.useContext(StepperContext)
  if (!ctx) return null
  return <>{_props.children}</>
}
