import Link from "next/link";
import { FC, useState, useEffect, memo } from "react";
import Slider from "react-slick";
import { PlusButton } from "../Inputs";
import { format } from "../../utils/FormatTime";
import { Markup } from "interweave";
import { fetchCategory, Post, category,OnePost } from "../../interfaces";
import { createURL } from "../../utils/UrlImage";
import { createSrcSet } from '../../utils/CreateSrcSet';
import { capitalize } from '../../utils/Capitalize';

interface propsMagazine {
  posts: Post[];
  categories: Partial<category>[];
}
export const Magazine: FC<propsMagazine> = ({ posts: data = [], categories }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <div className="w-full bg-color-base py-10 md:py-20 relative px-5">
      <div className="max-w-screen-lg mx-auto inset-x-0">
      <Link href={"/magazine"} passHref>
        <h2 className="md:hidden font-title text-6xl md:text-7xl w-full text-center md:text-left text-primary">
          Magazine
        </h2>
        </Link>
        {posts?.length > 0 && <Principal {...posts[0]} />}
        <BlogCategories categories={categories} />
        <GridPost data={posts?.slice(1)} />
        <span className="absolute bottom-0 mx-auto inset-x-0 transform translate-y-2 hover:scale-105 transition">
          <PlusButton size={"medium"} />
        </span>
      </div>
    </div>
  );
};

export default Magazine;

export const Principal: FC<OnePost> = ({
  title,
  content,
  categories,
  createdAt,
  imgMiniatura,
  slug
}) => {
  return (
    <div className="w-full relative  grid-cols-2 hidden md:grid ">
      <Link href={"/magazine"} passHref>
      <h2 className="font-title text-6xl md:text-7xl text-primary cursor-pointer hover:text-rose-400 transition">Magazine</h2>
      </Link>
      <div className="bg-white w-3/5 rounded-2xl shadow-lg h-max absolute top-1/3 py-6 px-12">
      <Link href={`/magazine/${slug}`} passHref>
        <h2 className="font-bold text-xl cursor-pointer hover:text-gray-700 transition text-gray-800">{title}</h2>
        </Link>
        <div className="grid grid-cols-8 pt-3">
          <div className="col-span-2 flex flex-col justify-center items-start border-r pr-3 border-primary py-1">
            <h3 className="text-primary text-xs">
              {Array.isArray(categories) && categories[0]}
            </h3>
            <p className="text-gray-600 text-xs">
              {createdAt && format(new Date(createdAt), "es", { dateStyle: "long" })}
            </p>
          </div>
          <div className="col-span-6 px-4 flex items-center text-xs text-gray-700">
            <Markup content={content.slice(0,300)} noHtml />
          </div>
        </div>
      </div>
      
      <img
          alt={title}
          className="h-80 w-full rounded-2xl object-cover float-right"
          src={createURL(imgMiniatura?.i640)}
          srcSet={createSrcSet(imgMiniatura)}
        />
    </div>
  );
};

const BlogCategories: FC<{ categories: Partial<category>[] }> = ({
  categories: data,
}) => {
  const [categories, setCategories] = useState<Partial<category>[]>([]);

  useEffect(() => {
    setCategories(data);
  }, [data]);

  interface propsCategory {
    title: string | undefined;
    route: string | undefined;
  }

  const Category: FC<propsCategory> = ({ title, route }) => {
    return (
      <Link href={route ? `/magazine/categoria/${route}` : ""} passHref>
        <button className="rounded-full px-4 w-max mx-auto inset-x-0 text-sm flex items-center py-2 justify-center text-tertiary font-medium border border-primary bg-white hover:bg-primary hover:text-white transition ease-in duration-200 cursor-pointer flex-wrap">
          {title && capitalize(title)}
        </button>
      </Link>
    );
  };

  const settings = {
    speed: 200,
    infinite: false,
    slidesToShow: 4,
    arrows: false,
    autoplay: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          rows: 1,
        },
      },

      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          rows: 1,
        },
      },
    ],
  };
  return (
    <div className="w-full py-10">
      <Slider {...settings}>
        {categories?.map((item, idx) => (
          <Category
            key={idx}
            title={item?.title}
            route={item?.slug}
          />
        ))}
      </Slider>
    </div>
  );
};

export const GridPost: FC<{ data: Partial<Post>[] }> = ({ data }) => {
  const [posts, setPosts] = useState<Partial<Post>[]>([]);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  const settings = {
    speed: 200,
    infinite: false,
    slidesToShow: 4,
    arrows: false,
    autoplay: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          rows: 1,
        },
      },

      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          rows: 1,
        },
      },
    ],
  };
  return (
    <div className="w-full grid grid-cols-1 h-full overflow-hidden">
      <Slider {...settings}>
        {posts?.map((item: Partial<Post>) => (
          <PostComponent key={item?._id} {...item} />
        ))}
      </Slider>
    </div>
  );
};

export const PostComponent: FC<Partial<Post>> = memo(
  (props) => {
    const { title, content, updatedAt, imgMiniatura, slug } = props
    return (
      <div className="w-[90%] h-full mx-auto my-6 inset-x-0 bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:opacity-95 transition-all cursor-pointer duration-400 border ">
        <img
          alt={title}
          className="h-40 w-full object-cover object-center"
          src={createURL(imgMiniatura?.i640)}
          srcSet={createSrcSet(imgMiniatura)}
        />
        <div className="py-5 text-center h-full">
          <Link href={`/magazine/${slug}`} passHref>
          <h2 className=" text-gray-700 text-md font-semibold border-b border-primary pb-3 px-5 leading-5 cursor-pointer hover:text-gray-800">
           <Markup content={title} className={"md:line-clamp-2 line-clamp-1"}/> 
          </h2>
          </Link>
          <div className="flex justify-between items-center py-2 px-5">
            <p className="text-xs tracking-widest text-primary">CEREMONIA</p>
            {updatedAt && <p className="text-xs text-gray-500">{format(new Date(updatedAt), "es")}</p>}
          </div>
          <p className="text-xs px-4 py-2 text-gray-500 ">
          <Markup className="line-clamp-6" content={content}/* {`${content?.slice(0, 250)}...`} */ noHtml />
          </p>
        </div>
      </div>
    );
  }
);
