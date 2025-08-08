import React from "react"
import SigninForm from "./components/forms/SigninForm"

const page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-1/4">
        <SigninForm />
      </div>
    </div>
  )
}

export default page
