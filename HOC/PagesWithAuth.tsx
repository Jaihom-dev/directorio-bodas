import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../components/Loading";
import { AuthContextProvider, LoadingContextProvider } from "../context";

enum TypesUsers {
  "novia",
  "novio",
  "otro",
  "empresa"
}

// const List: TypeOption[] = [
//   { title: "novia", icon: "/FormRegister/icon-women.webp" },
//   { title: "novio", icon: "/FormRegister/icon-men.webp" },
//   { title: "otro", icon: "/FormRegister/icon-heart.webp" },
//   { title: "empresa", icon: "/FormRegister/icon-business.webp" },
// ];
const PagesWithAuth  = (WrappedComponent: any, authorizationByRole?: keyof typeof TypesUsers) => {
  return (props: any) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const { user } = AuthContextProvider();
      const router = useRouter();
      const sessionCookie = Cookies.get("sessionBodas");
      const {setLoading} = LoadingContextProvider()
      
      
      if (!user && !sessionCookie) {
        router.replace("/")
        return <Loading />;
      }

      if(authorizationByRole){
        const lowerRole = user?.role?.map(item => item.toLowerCase())
        if(lowerRole?.includes(authorizationByRole)){
          return <WrappedComponent {...props} />;
        } else {
          router.replace("/")
          return <Loading />;
        }
      }

      return <WrappedComponent {...props} />;
      
    }

    // If we are on server, return null
    return null;
  };
};

export default PagesWithAuth;
