import React from "react"
import SignupWizard from "./components/SignupWizard"
import PurpleGradientBackground from "@/components/ui/purple-gradient-background"
import Logo from "@/components/ui/logo"

const page = () => {
  return (
    <PurpleGradientBackground>
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header con logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo width={240} height={80} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Capacitación y formación virtual
            </h1>
            <p className="text-white/80 text-lg">
              Registro de usuario
            </p>
          </div>

          {/* Wizard en un container con fondo blanco */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <SignupWizard />
          </div>
        </div>
      </div>
    </PurpleGradientBackground>
  )
}

export default page