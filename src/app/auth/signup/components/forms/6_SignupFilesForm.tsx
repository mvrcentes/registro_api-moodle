"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import { FormFieldType } from "@/lib/types"
import CustomFormField from "@/components/reusable/CustomFormField"
import type { FileState } from "@/components/reusable/dropzone/FileDropZone"
import { SignupFilesFormSchema } from "@/features/auth/schemas/auth.schema"

interface SignupFilesFormProps {
  onValidityChange?: (valid: boolean) => void
  onCreated?: () => void
}

const SignupFilesForm = ({
  onCreated,
  onValidityChange,
}: SignupFilesFormProps) => {
  const [isLoading, setLoading] = useState(false)
  const [dpiFiles, setDpiFiles] = useState<FileState[]>([])
  const [contratoFiles, setContratoFiles] = useState<FileState[]>([])
  const [certProfFiles, setCertProfFiles] = useState<FileState[]>([])

  const form = useFormContext()

  React.useEffect(() => {
    if (!onValidityChange) return
    const compute = () => {
      const v = form.getValues()
      const valid =
        !!v.pdf_dpi && !!v.pdf_contrato && !!v.pdf_certificado_profesional
      onValidityChange(valid)
    }
    compute()
    const sub = form.watch(() => compute())
    return () => sub.unsubscribe()
  }, [form, onValidityChange])

  return (
    <Form {...form}>
      <div className="flex flex-row gap-8 items-start justify-between w-full">
        {/* <Label htmlFor="pdf_dpi">DPI</Label> */}
        <CustomFormField
          form={form}
          control={form.control}
          fieldType={FormFieldType.FILE}
          name="pdf_dpi"
          label="Subir archivo de DPI atras y adelante"
          description="Sube un archivo PDF que contenga el DPI (Documento Personal de Identificación) por ambos lados."
          placeholder="Selecciona o arrastra el archivo aquí"
          acceptedFiles={{ "application/pdf": [".pdf"] }}
          setFileStates={setDpiFiles}
          fileStates={dpiFiles}
          maxFiles={1}
          className="w-[300px] max-w-full"
        />

        {/* <Label htmlFor="pdf_contrato">Contrato Firmado</Label> */}
        <CustomFormField
          form={form}
          control={form.control}
          fieldType={FormFieldType.FILE}
          name="pdf_contrato"
          label="Subir archivo de contrato firmado"
          description="Sube un archivo PDF que contenga el contrato firmado."
          placeholder="Selecciona o arrastra el archivo aquí"
          acceptedFiles={{ "application/pdf": [".pdf"] }}
          setFileStates={setContratoFiles}
          fileStates={contratoFiles}
          maxFiles={1}
          className="w-[300px] max-w-full"
        />

        {/* <Label htmlFor="pdf_certificado_profesional">Certificado Profesional</Label> */}
        <CustomFormField
          form={form}
          control={form.control}
          fieldType={FormFieldType.FILE}
          name="pdf_certificado_profesional"
          label="Subir archivo de certificado profesional"
          description="Sube un archivo PDF que contenga tu certificado profesional."
          placeholder="Selecciona o arrastra el archivo aquí"
          acceptedFiles={{ "application/pdf": [".pdf"] }}
          setFileStates={setCertProfFiles}
          fileStates={certProfFiles}
          maxFiles={1}
          className="w-[300px] max-w-full"
        />
      </div>
    </Form>
  )
}

export default SignupFilesForm
