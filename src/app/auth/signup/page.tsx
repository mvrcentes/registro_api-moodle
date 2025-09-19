import React from "react"
import SignupWizard from "./components/SignupWizard"
import PurpleGradientBackground from "@/components/ui/purple-gradient-background"
import Logo from "@/components/ui/logo"

const page = () => {
  return (
<<<<<<< Updated upstream
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
=======
    <div className="flex flex-col h-screen p-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-4xl p-6">
          <SignupWizard />
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/auth/signin" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
>>>>>>> Stashed changes
      </div>
    </PurpleGradientBackground>
  )
}

export default page
