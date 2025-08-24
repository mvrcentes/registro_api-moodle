import React from 'react'

interface BackgroundProps {
  children: React.ReactNode
  className?: string
}

export const PurpleGradientBackground: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Fondo gradiente principal */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom right, #3525ac, #3296cf, #3525ac)'
      }} />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-10 right-20 w-4 h-4 rounded-full opacity-95" style={{ backgroundColor: '#d7bf0f' }} />
      <div className="absolute top-32 right-32 w-3 h-3 rounded-full opacity-90" style={{ backgroundColor: '#d7bf0f' }} />
      <div className="absolute top-20 right-10 w-2 h-2 rounded-full opacity-85" style={{ backgroundColor: '#d7bf0f' }} />
      
      <div className="absolute bottom-32 left-20 w-6 h-6 rounded-full opacity-90" style={{ backgroundColor: '#d7bf0f' }} />
      <div className="absolute bottom-20 left-32 w-4 h-4 rounded-full opacity-85" style={{ backgroundColor: '#d7bf0f' }} />
      <div className="absolute bottom-40 left-10 w-3 h-3 rounded-full opacity-95" style={{ backgroundColor: '#d7bf0f' }} />
      
      {/* Círculos grandes decorativos */}
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full opacity-40 transform translate-x-1/2" style={{ backgroundColor: '#3296cf' }} />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full opacity-35 transform -translate-x-1/2" style={{ backgroundColor: '#3296cf' }} />

      {/* Elementos geométricos */}
      <div className="absolute top-1/3 right-24 w-8 h-8 opacity-70 transform rotate-45" style={{ backgroundColor: '#3296cf' }} />
      <div className="absolute bottom-1/3 left-24 w-6 h-6 opacity-65 transform rotate-12" style={{ backgroundColor: '#d7bf0f' }} />
      
      {/* Iconos simulados */}
      <div className="absolute top-1/2 right-16 w-12 h-12 border-2 border-white opacity-60 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 border border-white rounded" />
      </div>
      
      <div className="absolute top-3/4 right-40 w-10 h-10 border-2 opacity-75 rounded-full flex items-center justify-center" style={{ borderColor: '#d7bf0f' }}>
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#d7bf0f' }} />
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default PurpleGradientBackground
