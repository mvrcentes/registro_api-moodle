import React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CircleCheck, CircleX } from "lucide-react"

type PasswordDialogStatus = "success" | "error"

interface PasswordDialogProps {
  title: string
  description: string
  open: boolean
  status: PasswordDialogStatus
  email?: string
  password?: string
  message?: string
  onClose: () => void
  onDownloadPassword?: () => void
}

const PasswordDialog = ({
  title,
  description,
  open,
  status,
  email,
  password,
  message,
  onClose,
  onDownloadPassword,
}: PasswordDialogProps) => {
  const isSuccess = status === "success"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            {isSuccess ? (
              <CircleCheck className="h-16 w-16 text-emerald-500" />
            ) : (
              <CircleX className="h-16 w-16 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-center">
            {description}
          </DialogDescription>
          {message && (
            <p
              className={`mt-2 text-center text-sm ${
                isSuccess ? "text-emerald-600" : "text-red-600"
              }`}>
              {message}
            </p>
          )}
        </DialogHeader>

        {/* Tabla solo si hay email y password */}
        {isSuccess && email && password && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs">Email</Label>
              <Input value={email} disabled readOnly />
            </div>
            <div>
              <Label className="mb-1 block text-xs">Contraseña Temporal</Label>
              <Input value={password} disabled readOnly />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {isSuccess && email && password && onDownloadPassword && (
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadPassword}>
              Descargar contraseña
            </Button>
          )}

          <DialogClose asChild>
            <Button type="button" onClick={onClose}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordDialog
