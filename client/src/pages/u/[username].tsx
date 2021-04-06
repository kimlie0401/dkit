import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Comment, Post } from "../../types";
import dayjs from "dayjs";

export default function user() {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<any>(username ? `/users/${username}` : null);
  if (error) router.push("/");

  if (data) console.log(data);
  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex flex-col pt-5 md:flex-row">
          <div className="w-full px-2 md:w-160 md:px-0">
            {data.submissions.map((submission: any) => {
              if (submission.type === "Post") {
                const post: Post = submission;
                return <PostCard key={post.identifier} post={post} />;
              } else {
                const comment: Comment = submission;
                return (
                  <div
                    key={comment.identifier}
                    className="flex my-4 bg-white rounded shadow-md"
                  >
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                      <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                    </div>
                    <div className="w-full p-2">
                      <p className="mb-2 text-xs text-gray-500">
                        {comment.username}
                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a className="font-semibold cursor-pointer hover:underline">
                            {comment.post.title}
                          </a>
                        </Link>
                        <span className="mx-1">•</span>
                        <Link href={`/r/${comment.post.subName}`}>
                          <a className="text-black cursor-pointer hover:underline">
                            /r/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <hr />
                      <p className="mt-2">{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="order-first w-full px-2 mb-6 md:order-last md:px-0 md:ml-6 md:w-80">
            <div className="bg-white rounded shadow-md">
              <div className="p-3 bg-blue-500 rounded-t">
                <img
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="user profile"
                  className="w-16 h-16 mx-auto border-2 border-white rounded-full"
                />
              </div>
              <div className="p-3 text-center">
                <h1 className="mb-3 text-xl">{data.user.username}</h1>
                <hr />
                <p className="mt-3">
                  Joined {dayjs(data.user.createdAt).format("MMM YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
