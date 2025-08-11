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
      const cui = (form.getValues("cui") as string) || ""
      // usa tu schema; exige 13 chars
      return SignupPreFillSchema.safeParse({ cui }).success
    }
  }, [form])

  return (
    <Form {...form}>
      <div className="space-y-4">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="cui"
          label="CUI"
          placeholder="Ingrese su CUI"
        />
      </div>
    </Form>
  )
}

export default SignupPreFillForm
