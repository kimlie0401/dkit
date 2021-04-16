import Head from "next/head";
import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { useSWRInfinite } from "swr";
import Image from "next/image";

import PostCard from "../components/PostCard";
import { Post, Sub } from "../types";
import Link from "next/link";
import { useAuthState } from "../context/auth";
import Loader from "../components/Loader";

dayjs.extend(relativeTime);

export default function Home() {
  const [observedPost, setObservedPost] = useState("");

  // const { data: posts } = useSWR<Post[]>("/posts");
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const description =
    "Dkit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
  const title = "Dkit: the front page of the internet";

  const { authenticated } = useAuthState();

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`, {
    revalidateAll: true,
  });

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entreis) => {
        if (entreis[0].isIntersecting === true) {
          // console.log("Reached bottom of post");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get("/posts")
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>
      <div className="container flex flex-col pt-4 md:flex-row">
        {/* Post feed */}
        <div className="w-full px-2 md:w-160 md:px-0">
          {isInitialLoading && <Loader />}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && <Loader />}
        </div>
        {/* Sidebar */}
        <div className="order-first w-full px-2 mb-6 md:px-0 md:ml-6 md:order-last md:w-80">
          <div className="bg-white rounded shadow-md">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs ? (
                topSubs?.map((sub) => (
                  <div
                    className="flex items-center px-4 py-2 text-xs border-b"
                    key={sub.name}
                  >
                    <Link href={`/r/${sub.name}`}>
                      <a>
                        <Image
                          className="rounded-full cursor-pointer"
                          src={sub.imageUrl}
                          alt="Sub"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </a>
                    </Link>

                    <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold hover:cursor-pointer">
                        /r/{sub.name}
                      </a>
                    </Link>
                    <p className="ml-auto font-medium">{sub.postCount}</p>
                  </div>
                ))
              ) : (
                <Loader />
              )}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
// *ServerSide Rendering*
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }
