import Link from "next/link"
import { Dispatch, FC, SetStateAction } from "react"
import ClickAwayListener from "react-click-away-listener"
import { SidebarContextProvider } from "../../context"
import { CarIcon as SettingsIcon } from "../Icons"

type ItemNav = {
    title: string
    route: string

}

interface propsSidebar {
    set: Dispatch<SetStateAction<boolean>>
    state : boolean
}

export const Sidebar: FC <propsSidebar> = ({set, state}) => {
    
    const FirstList: ItemNav[] = [
        { title: "Mi boda", route: "http://192.168.10.10:3000" },
        { title: "Novia", route: "/categoria/novias" },
        { title: "Novio", route: "/categoria/novios" },
        { title: "Proveedores", route: "/categoria/proveedores" },
        { title: "Lugares para bodas", route: "/categoria/lugares-para-bodas" },
    ]

    const SecondaryList: ItemNav[] = [
        { title: "Magazine", route: "/magazine" },
        { title: "Gestor de invitados", route: "https://app.bodasdehoy.com" },
    ]
    return (
        <ClickAwayListener onClickAway={() => state && set(false)}>
        <div className={`fixed bg-white shadow-lg z-40 h-screen w-80 transform transition top-0 left-0  ${state ? "translate-x-0" : "-translate-x-full"} `}>
            <div className="relative w-full h-full">
                <div className="p-10">
                    <p className="text-primary text-md font-light pb-4">Accede <span className="text-tertiary">o</span> Regístrate</p>
                    <BlockButtons list={FirstList} />
                    <BlockButtons list={SecondaryList} />
                    <div className="w-full py-4 border-t border-base gap-2 flex flex-col items-center">
                        <p className="text-tertiary">Nuestro contacto</p>
                        <Link href={"/info-empresa"} passHref>
                        <button className="focus:outline-none bg-primary text-white text-sm py-1 w-max px-4 rounded-full"> Acceso a empresas</button>
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-100 py-4 w-full px-5 flex gap-2 items-center justify-start absolute bottom-0 right-0">
                    <SettingsIcon className="text-gray-200 w-5 h-5" />
                    <p className="text-gray-200">Configuración</p>
                </div>
            </div>
        </div>
        </ClickAwayListener>
    )
}


interface propsBlock {
    list: ItemNav[]
}
const BlockButtons: FC<propsBlock> = ({ list }) => {
    return (
        <div className="w-full py-4 border-t border-base gap-2 flex flex-col">
            {list.map((item, idx) => (
                <Link key={idx} href={item.route} passHref>
                    <p className="text-tertiary">{item.title}</p>
                </Link>
            ))}
        </div>
    )
}

