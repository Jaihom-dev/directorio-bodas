import { FC, MouseEventHandler } from "react";
import { EditIcon } from "../components/Icons";
import {AuthContextProvider} from '../context'

const perfil = () => {
    const { user } = AuthContextProvider()

  return (
    <>
      <section className="w-full bg-base -mt-20 md:-mt-0">
        <div className="max-w-screen-lg mx-auto inset-x-0 py-10 grid gap-10 font-display px-5">
          <div className="bg-white rounded-xl w-full shadow overflow-hidden relative h-fit">
            <img alt={"1"} className="h-40 object-cover object-center w-full" src={"/placeholder/image.png"}/>
              <EditIcon className="cursor-pointer transition hover:rotate-12 transform absolute top-4 right-4 text-primary w-6 h-6" />
            <img alt={user?.displayName ?? ""} className="rounded-full p-1 bg-white h-40 w-40 object-cover absolute top-12 inset-x-0 md:inset-x-auto md:left-10 mx-auto" src={user?.photoURL ? user.photoURL : "/placeholder/user.png"} />
            <div className="font-display pb-14 pt-16 px-10 leading-5 flex flex-col gap-1 items-center md:items-start">
             {!user ? <SkeletonHeader /> : (
               <>
               <h2 className="font-semibold text-xl text-primary">{user?.displayName}</h2>
              <p className="font-regular text-md text-gray-600">{user.role && user?.role?.length > 0 && user?.role[0]}</p>
              <p className="font-regular text-xs text-gray-600 flex gap-4 pt-2">{user?.city}</p>
              {/* <div className="flex gap-6 pt-4">
                <Button text="Seguir" variant={"primary"} onClick={handleClick} />
                <Button text="Compartir perfil" variant={"inverse"} onClick={handleClick} />
              </div> */}
               </>
             )}
            </div>
          </div>

          <div className="bg-white rounded-xl h-max py-6 w-full shadow-lg overflow-hidden relative">
            <svg className="absolute w-full h-1 top-0 bg-primary"/>
            <h2 className="text-xl text-primary px-10 py-2">Ultima Actividad</h2>
            <p className="md:text-sm text-gray-500 px-10 text-xs">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore quod quia sequi, assumenda sunt eius dicta eveniet eum. Soluta rem aliquid minima delectus nisi blanditiis impedit, deserunt voluptatibus incidunt quos.</p>
          </div>
        </div>
            
      </section>
      {/* <style jsx>
        {`
          section {
            min-height: calc(100vh - 9rem);
          };

        `}
      </style> */}
    </>
  );
};

export default perfil;

const variants = {
  primary: `text-white bg-primary hover:text-primary hover:bg-color-base border border-primary`,
  inverse: `text-primary bg-white border-primary border hover:text-white hover:bg-primary`
}

interface propsButton {
  onClick : MouseEventHandler,
  text: string,
  variant: keyof typeof variants
}
const Button : FC <propsButton> = ({onClick, text, variant = "primary"}) => {
  return (
    <button
    onClick={onClick}
    className={`focus:outline-none rounded-xl px-4 py-2 transition text-sm ${variants[variant]}`}>
      {text}
    </button>
  )
}

const SkeletonHeader = () => {
  return (
    <div className="flex flex-col items-center md:items-start gap-2 pt-2">
      <div className="h-5 bg-slate-300 w-1/4 py-1 animate-pulse rounded-md"/>
      <div className="h-5 bg-slate-300 w-1/6 py-1 animate-pulse rounded-md"/>
      <div className="h-3 bg-slate-300 w-48 py-1 animate-pulse rounded-md"/>
      {/* <div className="flex gap-6 items-center pt-4">
      <div className="h-8 bg-slate-300 rounded-full w-24 animate-pulse"/>
      <div className="h-8 bg-slate-300 rounded-full w-32 animate-pulse"/>
      </div> */}
    </div>
  )
}