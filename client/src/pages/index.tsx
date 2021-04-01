import Head from "next/head";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";

import { Post } from "../types";

import PostCard from "../components/PostCard";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR("/posts");

  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get("/posts")
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>Dkit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-full px-2 md:w-160 md:px-0">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
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
