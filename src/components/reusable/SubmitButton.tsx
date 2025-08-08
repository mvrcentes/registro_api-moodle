import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"

import loader from "@icons/loader.svg"

interface SubmitButtonProps {
  isLoading: boolean
  className?: string
  children: React.ReactNode
}

export const SubmitButton = ({
  isLoading,
  className,
  children,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={className ?? "shad-primary-btn w-full"}
      disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src={loader}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
