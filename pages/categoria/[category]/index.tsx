import Slider from "react-slick";
import { FC, ReactNode, useState, useEffect, useRef } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { fetchApi, queries } from "../../../utils/Fetching";
import {
  business,
  category,
  characteristicSubCategory,
  subCategory,
} from "../../../interfaces";
import { useHover } from "../../../hooks";
import { createURL } from "../../../utils/UrlImage";
import {
  CardBusiness,
  HeaderCategory,
  ItemSubCategory,
} from "../../../components/Category";
import useFetch from "../../../hooks/useFetch";
import { LoadingItem } from "../../../components/Loading";
import EmptyComponent from "../../../components/Surface/EmptyComponent";
import {
  FiltersContextProvider,
  FiltersProvider,
} from "../../../context/FiltersContext";
import {
  LocationFilter,
  CheckBoxFilter,
} from "../../../components/Inputs/Filters";
import { BurgerIcon } from "../../../components/Icons";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import SkeletonCardBusiness from "../../../components/Category/SkeletonCardBusiness";

const CategoryPage: FC<category> = (props) => {
  const { _id, imgBanner, subCategories, heading, title, description, slug } =
    props;

  const settings = {
    autoplay: true,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    arrows: false,
    centerMode: true,
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

  const [characteristics, setCharacteristics] = useState([]);

  useEffect(() => {
    const characteristicsReduce = subCategories?.reduce(
      (acc: any, subcategory) => {
        subcategory.characteristics?.forEach((characteristic) => {
          if (
            acc.findIndex(
              (item: characteristicSubCategory) =>
                item.title === characteristic.title
            ) === -1
          ) {
            acc.push(characteristic);
          }
        });

        return acc;
      },
      []
    );
    setCharacteristics(characteristicsReduce);
  }, [subCategories, _id]);

  return (
    <section className="flex flex-col gap-10 ">
      <div>
        {/* Imagen Banner */}
        <img
          src={
            imgBanner?.i640
              ? createURL(imgBanner?.i640)
              : "/placeholder/image.png"
          }
          alt={title}
          className="w-full h-60 transform -mt-20 z-10 object-center object-cover"
        />
        <HeaderCategory {...props} />
      </div>

      {/* Grid Cards */}
      <div className="max-w-screen-lg 2xl:max-w-screen-xl w-full mx-auto inset-x-0 grid grid-cols-1 items-center justify-between top-0 px-10  ">
        <Slider {...settings} className="space-y-10">
          {subCategories?.length > 0 &&
            subCategories.map((item: subCategory) => (
              <ItemSubCategory key={item._id} {...item} slugCategory={slug} />
            ))}
        </Slider>
      </div>

      {/* Aside Filters */}
      <div className="xl:max-w-screen-lg 2xl:max-w-screen-xl gap-4 md:gap-10 mx-auto inset-x-0 grid md:grid-cols-7 2xl:grid-cols-5 w-full">
        <FiltersProvider>
          <Filters optionsCheckbox={{ characteristics }} />
          <GridCards query={{categories : _id}} />
        </FiltersProvider>
      </div>
    </section>
  );
};

export default CategoryPage;

export const GridCards: FC<{ query: object }> = ({ query }) => {
  const { filters, setFilters } = FiltersContextProvider();
  const [limit, setLimit] = useState(9);
  const [skip, setSkip] = useState(0);
  const initialQuery = {
    query: queries.getAllBusiness,
    variables: { criteria: { ...filters?.filters, ...query }, skip, limit },
  };
  const [data, setData, loading, error, fetchy] = useFetch(initialQuery);

  const [isFetching, setIsFetching, stop] = useInfiniteScroll(getMoreFeed);

  async function getMoreFeed() {
    try {
      if (skip >= data.total) {
        stop.current = true;
        return;
      }
      setSkip(skip + limit);
      const additionalData = await fetchApi({
        query: queries.getAllBusiness,
        variables: {
          criteria: { ...filters?.filters, ...query },
          skip: skip + limit,
          limit,
        },
      });

      setData((old: { total: number; results: business[] }) => ({
        total: additionalData.total,
        results: [...old?.results, ...additionalData?.results],
      }));
    } catch (error) {
      console.log(error);
    } finally{
      setIsFetching(false)
    }
  }
  useEffect(() => {
    setFilters({ type: "RESET_FILTER", payload: {} });
    fetchy(initialQuery);
  }, [query]);

  useEffect(() => {
    setLimit(9);
    setSkip(0);
    fetchy(initialQuery)
  }, [filters]);

  return (
    <div className="md:col-span-5 2xl:col-span-4 w-full">
      <div className="flex items-center justify-start gap-4 px-5 py-5 w-full">
        <p className="text-sm text-gray-500 ">
          Resultados encontrados: {data?.total ?? 0}
        </p>
        {/* {JSON.stringify(filters)} */}
      </div>
      {!loading && !error && data?.results?.length > 0 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6 px-5 overflow-hidden   ">
          
          {data?.results.map((business: business) => (
            <CardBusiness key={business._id} {...business} />
          ))}
          {isFetching && skip <= data.total  && (
            <>
            <SkeletonCardBusiness />
            <SkeletonCardBusiness />
            <SkeletonCardBusiness />
            <SkeletonCardBusiness />
            <SkeletonCardBusiness />
            <SkeletonCardBusiness />
            </>
          )}
        </div>
      )}
      {loading && (
        <div className="min-h-40 h-40 w-full grid place-items-center text-gray-700">
          <LoadingItem text={"Cargando"} size={"small"} />
        </div>
      )}
      {error && "error"}
      {!loading && !error && data?.results?.length === 0 && (
        <EmptyComponent text={"No hay resultados"} />
      )}
    </div>
  );
};

interface propsFilter {
  optionsCheckbox: {
    characteristics: characteristicSubCategory[];
  };
}

export const Filters: FC<propsFilter> = ({ optionsCheckbox }) => {
  const { characteristics } = optionsCheckbox;
  const { filters, setFilters } = FiltersContextProvider();

  const handleResetFilters = () => {
    setFilters({ type: "RESET_FILTER", payload: {} });
  };

  const [open, setOpen] = useState(true);
  const onClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <button onClick={onClick} className="md:hidden flex items-center px-5 gap-3 text-sm  text-gray-700">
        <BurgerIcon />
        Filtrar
      </button>

      <aside className="md:col-span-2 2xl:col-span-1 bg-white h-max w-full rounded-lg shadow  ">
        <div className={`md:block ${open ? "hidden" : "block"} `}>
          <div className="py-4 px-6 border-b border-base flex items-center justify-between gap-2 ">
            <span className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Filtros activos</p>
              <span className="rounded-full border border-primary text-xs text-primary w-6 h-6 flex items-center justify-center">
                {filters?.total}
              </span>
            </span>
            <button
              onClick={handleResetFilters}
              className="px-2 w-max border border-primary focus:outline-none bg-white text-primary text-xs rounded-full py-1 hover:text-white hover:bg-primary transition"
            >
              Limpiar
            </button>
          </div>
          <LocationFilter />
          {characteristics?.map((item, idx) => (
            <CheckBoxFilter
              key={idx}
              label={item.title}
              options={item.items.map((item) => ({
                label: item.title,
                _id: item.title,
              }))}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

interface propsEventType {
  title: string;
  list: { icon: ReactNode; title: string }[];
}

export const getStaticProps: GetStaticProps = async ({
  params,
  ...rest
}: any) => {
  try {
    console.time("Category Page queries");
        const {
          results: [category],
        } = await fetchApi({
          query: queries.getAllCategoryBusiness,
          variables: {
            criteria: { slug: params.category },
          },
        });
        console.timeEnd("Category Page queries");
        return {
          props: category ?? {},
        };
    
    } catch (error) {
    console.timeEnd("Category Page queries");
    //console.log(error);
    return {
      props: {},
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { results } = await fetchApi({ query: queries.getCategories });
    const paths = results.reduce(
      (acc: { params: { category: string } }[], category: category) => {
          category.slug && acc.push({ params: { category: category.slug } })
        return acc;
      },
      []
    );
    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    //console.log(error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};
