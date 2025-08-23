import React from 'react'

interface BackgroundProps {
  children: React.ReactNode
  className?: string
}

export const PurpleGradientBackground: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Fondo gradiente principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-600 to-purple-800" />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-10 right-20 w-4 h-4 bg-yellow-400 rounded-full opacity-80" />
      <div className="absolute top-32 right-32 w-3 h-3 bg-green-400 rounded-full opacity-70" />
      <div className="absolute top-20 right-10 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
      
      <div className="absolute bottom-32 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-60" />
      <div className="absolute bottom-20 left-32 w-4 h-4 bg-green-400 rounded-full opacity-50" />
      <div className="absolute bottom-40 left-10 w-3 h-3 bg-cyan-400 rounded-full opacity-70" />
      
      {/* Círculos grandes decorativos */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-cyan-400 rounded-full opacity-20 transform translate-x-1/2" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-yellow-400 rounded-full opacity-15 transform -translate-x-1/2" />
      
      {/* Elementos geométricos */}
      <div className="absolute top-1/3 right-24 w-8 h-8 bg-cyan-400 opacity-40 transform rotate-45" />
      <div className="absolute bottom-1/3 left-24 w-6 h-6 bg-green-400 opacity-30 transform rotate-12" />
      
      {/* Iconos simulados */}
      <div className="absolute top-1/2 right-16 w-12 h-12 border-2 border-white opacity-30 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 border border-white rounded" />
      </div>
      
      <div className="absolute top-3/4 right-40 w-10 h-10 border-2 border-cyan-400 opacity-40 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-cyan-400 rounded-full" />
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default PurpleGradientBackground
