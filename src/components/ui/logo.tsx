import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  width = 200, 
  height = 60 
}) => {
  return (
    <div className={`${className}`}>
      <Image
        src="/Logo_CGC_48_1.png"
        alt="CGC Virtual - Capacitación y formación virtual"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  )
}

export default Logo
