import { FC, ReactNode, useState, useEffect, memo } from 'react';

const Slider : any = dynamic(() : any => import('react-slick'))
const DynamicAdsApp : any = dynamic(() : any => import('../components/Home').then((mod) => mod.AdsApp))
const DynamicCountriesListing : any = dynamic(() : any => import('../components/Home').then((mod) => mod.CountriesListing))
const DynamicPodcastList : any = dynamic(() : any => import('../components/Home').then((mod) => mod.PodcastList))
const DynamicFeaturedCompanies : any = dynamic(() : any => import('../components/Home').then((mod) => mod.FeaturedCompanies))
const DynamicMagazine : any = dynamic(() : any => import('../components/Home').then((mod) => mod.Magazine))
const DynamicPlaceDiscovery : any = dynamic(() : any => import('../components/Home').then((mod) => mod.PlaceDiscovery))
const DynamicRecommendCategories : any = dynamic(() : any => import('../components/Home').then((mod) => mod.RecommendCategories))


const DynamicCommunityIcon : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.CommunityIcon))
const DynamicDownloadFileIcon : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.DownloadFileIcon))
const DynamicGuestAppIcon : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.GuestAppIcon))
const DynamicInspirationIcon : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.InspirationIcon))
const DynamicIsologo : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.Isologo))
const DynamicSearchIcon : any = dynamic(() : any => import('../components/Icons').then((mod) => mod.SearchIcon))

import Image from "next/image";
import dynamic from 'next/dynamic';
import { GraphQL } from '../utils/Fetching';

interface propsHome {
  business: object[];
  categoriesBusiness : fetchCategory[]
  post : object[]
  categoriesPost : object[]
}

export interface fetchCategory {
  categorie : category
  subCategories: category[]
}


export type category = {
    title: string
    imgMiniatura : string
    imgBanner : string
    slug : string
    description : string
  }

const Home: FC<propsHome> = (props) => {
  
  
  return (
    <section className="w-full">
      <div className="sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg banner pt-6 md:pt-24 mx-auto inset-x-0 grid grid-col-2 relative w-full">
        <Welcome />
      </div>
      <DynamicPlaceDiscovery data={props?.categoriesBusiness} />
      <div className="bg-white flex flex-col gap-24 w-full pb-20">
        <DynamicFeaturedCompanies business={props?.business} />
        <ButtonProviders />
        <DynamicRecommendCategories data={props?.categoriesBusiness} />
        <DynamicMagazine posts={props?.post} categories={props?.categoriesPost} />
        <DynamicAdsApp />
        <DynamicPodcastList />
        {/* <DynamicCountriesListing /> */}
      </div>
      <style jsx>
        {`
          .banner::after {
            content: "";
            background: linear-gradient(
              0deg,
              #f2f2f2 50%,
              rgba(255, 255, 255, 0) 100%
            );
            width: 100%;
            height: 70%;
            position: absolute;
            bottom: 0;
          }
          @media screen and (max-width: 604px) {
            .banner::after {
              background: linear-gradient(
                0deg,
                #f2f2f2 20%,
                rgba(255, 255, 255, 0) 100%
              );
              height: 20%;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Home;

export const Welcome: FC = (props) => {
  return (
    <>
      <div className="relative grid md:grid-cols-2 px-5 sm:px-0 pb-16 pb-0 relative">
        <div className="flex flex-col gap-5 z-10 relative">
          <h1 className="text-2xl md:text-4xl text-tertiary relative subpixel-antialiased font-bold w-full flex flex-col gap-2">
            <span className="relative w-max h-max  font-light">
              Encuentra tod<b className="hidden">o</b>
              <DynamicIsologo className="mt-1 isologo absolute bottom-2 -right-4 md:-right-6" />
            </span>
            <span className="relative ">para una boda inolvidable</span>
          </h1>
          <p className="hidden md:block w-1/2 sm:w-full text-tertiary text-sm">
            Miles de proveedores de bodas en un sólo lugar.
          </p>
          <Searcher
            autoFocus={true}
            placeholder="catering, hoteles, fincas, vestidos"
          />
          <Features />
        </div>

        <div className="md:w-full w-1/2 md:relative absolute z-0 -bottom-16 md:bottom-0 right-0 md:-mt-20">
          <Image
            src={"/photo-principal.webp"}
            layout={"responsive"}
            height={80}
            width={50}
            objectFit="contain"
            objectPosition="top"
          />
        </div>
      </div>
    </>
  );
};

interface propsSearcher {
  autoFocus?: boolean;
  placeholder: string;
}
export const Searcher: FC<propsSearcher> = (props) => {
  return (
    <div className="relative w-full">
      <input
        className="px-6 h-14 py-1 md:py-3 w-full rounded-full text-gray-200 text-sm md:text-base focus:outline-none transition shadow-lg"
        {...props}
      />
      <button className="bg-primary w-14  h-full rounded-full absolute top-0 right-0 flex items-center justify-center transform hover:scale-110 transition hover:-rotate-12">
        <DynamicSearchIcon className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export const Features: FC = () => {
  type ItemList = {
    title: string;
    icon: ReactNode;
  };

  const List: ItemList[] = [
    {
      title: "Comunidad para novias",
      icon: <DynamicCommunityIcon className="w-8 h-8" />,
    },
    {
      title: "Recursos descargables",
      icon: <DynamicDownloadFileIcon className="w-8 h-8" />,
    },
    {
      title: "Gestor de invitados",
      icon: <DynamicGuestAppIcon className="w-8 h-8" />,
    },
    { title: "Inspiración", icon: <DynamicInspirationIcon className="w-8 h-8" /> },
  ];

  interface propsFeature {
    item: ItemList;
  }
  const Feature: FC<propsFeature> = memo(({ item }) => {
    return (
      <div className="flex items-center gap-3 py-3 pl-2 w-full ">
        <button className="p-4 bg-white shadow rounded-full bg-white grid place-items-center transform transition duration-800 hover:scale-110 hover:-rotate-12 focus:outline-none">
          {item.icon}
        </button>
        <h2 className="text-tertiary w-32 text-sm md:text-lg leading-6 font-semibold cursor-pointer hover:text-primary transition duration-800">
          {item.title}
        </h2>
      </div>
    );
  });

  const settings = {
    autoplay: true,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    rows: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesPerRow: 1,
          fade: true,
        },
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 overflow-visible z-50">
      <Slider {...settings}>
        {List.map((item, idx) => (
          <Feature key={idx} item={item} />
        ))}
      </Slider>
    </div>
  );
};

const ButtonProviders = () => {
  return (
    <button className="md:hidden rounded-full w-max -mt-20 px-6 py-2 mx-auto inset-x-0 bg-primary text-white text-sm border border-primary hover:bg-white hover:text-primary focus:outline-none">
      Ver más proveedores
    </button>
  );
};

export async function getServerSideProps() {
  try {
    console.log("empezo")
    console.time("hola")
    const data = await GraphQL.getHome()
    console.timeEnd("hola")
    return { props: data };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}

