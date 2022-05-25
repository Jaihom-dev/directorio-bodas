import React from 'react'
import { CrossIcon, UserIcon } from './Icons'
import { useHover } from '../hooks/useHover';
import { useRouter } from 'next/router';
import { AuthContextProvider } from '../context';

const ButtonCrearEmpresa = () => {
    const [hoverRef, isHovered] = useHover()
    const router = useRouter()
    const {user} = AuthContextProvider()
    const handleClick = async () => {
        const lowerCase = user?.role?.map((item : string) => item.toLowerCase())
        if(lowerCase?.includes("empresa")){
            router.push("/empresa")
        } else {
            router.push("/info-empresa")
        }
    }
  return (
    <div ref={hoverRef} onClick={handleClick} className={`hidden sm:flex cursor-pointer bg-color-base font-semibold rounded-full w-max px-4 text-xs py-2 text-primary fixed bottom-16 right-6 z-30 items-center gap-2  transition-all duration-500 shadow-lg`}>
        <CrossIcon/>
        Publica tu empresa aquí
    </div>
  )
}

export default ButtonCrearEmpresa