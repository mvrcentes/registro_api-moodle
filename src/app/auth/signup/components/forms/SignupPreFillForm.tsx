"use client"

import React, { useState, useEffect } from "react"
import { z } from "zod"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { SignupPreFillSchema } from "@/features/auth/schemas/auth.schema"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"

interface SignupPreFillFormProps {
  isPrefilled?: boolean
}

const SignupPreFillForm = ({ isPrefilled = false }: SignupPreFillFormProps) => {
  const form = useFormContext()

  useEffect(() => {
    const computeValid = () => {
      const dpi = (form.getValues("dpi") as string) || ""
      // usa tu schema; exige 13 chars
      return SignupPreFillSchema.safeParse({ dpi }).success
    }
  }, [form])

  return (
    <Form {...form}>
      <div className="space-y-4">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="dpi"
          label="DPI (CUI)"
          placeholder="Ingrese su DPI"
          readonly={isPrefilled}
          description={isPrefilled ? "Este campo no puede ser modificado después de la consulta" : undefined}
        />
      </div>
    </Form>
  )
}

export default SignupPreFillForm
