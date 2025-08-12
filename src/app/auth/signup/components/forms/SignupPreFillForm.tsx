"use client"

import React, { useState, useEffect } from "react"
import { z } from "zod"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { SignupPreFillSchema } from "@/features/auth/schemas/auth.schema"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"

const SignupPreFillForm = () => {
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
          label="DPI"
          placeholder="Ingrese su DPI"
        />
      </div>
    </Form>
  )
}

export default SignupPreFillForm
