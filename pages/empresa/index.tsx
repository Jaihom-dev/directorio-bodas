import Link from "next/link";
import { useState, useEffect, FC, MouseEventHandler } from "react";
import { ButtonComponent } from "../../components/Inputs";
import { AuthContextProvider } from "../../context";
import PagesWithAuth from "../../HOC/PagesWithAuth";
import { business, subCategory } from "../../interfaces";
import { createSrcSet } from "../../utils/CreateSrcSet";
import { createURL } from "../../utils/UrlImage";
import useFetch from "../../hooks/useFetch";
import { LoadingItem } from "../../components/Loading";
import { GraphQL, fetchApi, queries } from "../../utils/Fetching";
import { useToast } from "../../hooks/useToast";
import { useRouter } from "next/router";
import {
  DeleteIcon,
  EditIcon,
  EmptyIcon,
  ViewIcon,
} from "../../components/Icons";
import IconButton from "../../components/Inputs/IconButton";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import EmptyComponent from "../../components/Surface/EmptyComponent";

const query = `query ($uid : ID){
  getBusinesses(uid:$uid){
      _id,
      userUid,
      businessName,
      country,
      city,
      slug,
      zip,
      fase
      address,
      imgMiniatura{
        i1024
        i800
        i640
        i320
      }
      imgLogo{
        i1024
        i800
        i640
        i320
      }
      description,
    subCategories{
      _id
      title
    }
    }
}`;

const Empresas = () => {
  const { user } = AuthContextProvider();

  const initialQuery = {
    query,
    variables: { uid: user?.uid },
  }
  const [dato, setDato, loading, error, fetchy] = useFetch(initialQuery);


  const toast = useToast();

  const handleRemove = async (_id: string) => {
    try {
      await fetchApi({query : queries.deleteBusiness, variables: { id: _id }});
      fetchy(initialQuery)
      toast("success", "Eliminado con exito");
    } catch (error) {
      toast("error", JSON.stringify(error));
      console.log(error);
    }
  };

  return (
    <div className="container max-w-screen-lg mx-auto inset-x-0 py-10 w-full px-2 md:px-0">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-primary text-2xl font-semibold">Mis empresas</h1>
        <Link href={"/empresa/crear-empresa"} passHref>
          <ButtonComponent>+ Crear empresa</ButtonComponent>
        </Link>
      </div>

      <div className={"grid grid-cols-1 gap-10 py-10 w-full"}>
        {loading ? (
          <div className="h-40 w-full flex items-center justify-center transition text-primary">
              <LoadingItem text={"Cargando"} size="small" />
            </div>
                
        ) : (
          dato?.map((item: business) => (
              <BusinessItem
                key={item._id}
                {...item}
                handleRemove={handleRemove}
              />
          ))
        )}

        {!loading && !error && dato?.length === 0 && (
          <EmptyComponent text={"No hay empresas creadas"} />
        )}
        </div>
    </div>
  );
};

export default PagesWithAuth(Empresas, "empresa");

interface propsBusinessItem extends business {
  handleRemove: any;
}

const BusinessItem: FC<propsBusinessItem> = ({
  businessName,
  imgLogo,
  _id,
  handleRemove,
  subCategories,
  fase,
  slug,
}) => {

  const router = useRouter();
  console.log(router)

  const fases: any = {
    fase1: {
      color: "bg-yellow-500",
      text: "En proceso",
    },
    fase2: {
      color: "bg-green-500",
      text: "Publicado",
    },
  };

  return (
    <>
      <div className="w-full border border-gray-300 rounded-lg min-h-16  hover:bg-gray-200 transition flex md:flex-row items-center p-4 justify-between gap-10 relative overflow-hidden">
        {/* @ts-ignore */}
        <div className={`absolute h-6 w-28 ${fases[fase]?.color} top-0 left-0 opacity-80 flex items-center`}>
          {/* @ts-ignore */}
          <p className="text-white text-sm text-center w-full">
            {fases[fase]?.text}
          </p>
        </div>
        <img
          className="w-80 object-center object-cover rounded-sm h-14"
          alt={businessName}
          src={imgLogo?.i640 ? createURL(imgLogo?.i640) : "/mask_1.png"}
          srcSet={createSrcSet(imgLogo)}
        />
        <div className="flex flex-col md:flex-row md:space-x-20">
          <div>
            <p className="text-md text-gray-600 font-bold tracking-tight">
              {businessName ?? "Titulo de prueba"}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Identificador: </strong>
              {_id}
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              {subCategories.map((subcategory) => (
                <Badge key={subcategory._id} text={subcategory.title} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <IconButton
              onClick={() => router.push(`/empresa/${slug}`)}
              size={"sm"}
              variant={"primary"}
            >
              <ViewIcon />
            </IconButton>
            <IconButton
              onClick={() => router.push(`/empresa/crear-empresa?id=${_id}`)}
              size={"sm"}
              variant={"primary"}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleRemove(_id)}
              size={"sm"}
              variant={"primary"}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

export const Badge: FC<{ text: string }> = ({ text }) => {
  return (
    <p className="text-xs px-1 py-0.5 text-white bg-gray-500 rounded my-1">
      {text}
    </p>
  );
};
