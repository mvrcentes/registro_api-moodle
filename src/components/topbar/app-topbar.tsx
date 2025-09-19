"use client"

import Image from "next/image"
import UserDropDown from "./UserDropDown"

export function AppTopbar() {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src="/Logo_CGC_48_1.png"
          alt="Urbanfy Logo"
          width={100}
          height={100}
          className="h-8 w-auto min-w-[32px]"
        />
      </div>

      <UserDropDown />
    </div>
  )
}
