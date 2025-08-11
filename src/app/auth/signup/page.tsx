import React from "react"
import SignupWizard from "./components/SignupWizard"

const page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-4xl p-6">
        <SignupWizard />
      </div>
    </div>
  )
}

export default page
