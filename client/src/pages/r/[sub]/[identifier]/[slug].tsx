import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import useSWR from "swr";
import { FormEvent, useEffect, useState } from "react";

import Axios from "axios";
import Sidebar from "../../../../components/Sidebar";
import { Post, Comment } from "../../../../types";
import { useAuthState } from "../../../../context/auth";
import ActionButton from "../../../../components/ActionButton";

dayjs.extend(relativeTime);

export default function PostPage() {
  // Local state
  const [newComment, setNewComment] = useState("");
  const [description, setDescription] = useState("");
  // Global state
  const { authenticated, user } = useAuthState();

  // Utils
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error, revalidate: revalidatePost } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (error) router.push("/");

  useEffect(() => {
    if (!post) return;
    let desc = post.body || post.title;
    desc = desc.substring(0, 158).concat(".."); // Hello world..
    setDescription(desc);
  }, [post]);

  const vote = async (value: number, comment?: Comment) => {
    // If note logged in goto login
    if (!authenticated) router.push("/login");

    // If vote is the same reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && value === comment.userVote)
    )
      value = 0;

    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      if (!comment) revalidatePost();
      if (comment) revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });

      setNewComment("");

      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500 shadow-md">
            <div className="container flex">
              {post && (
                <div className="mr-2">
                  <Image
                    className="rounded-full"
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex flex-col pt-5 md:flex-row">
        {/* Post */}
        <div className="w-full px-2 md:w-160 md:px-0">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex p-2 sm:p-0">
                  {/* Vote section */}
                  <div className="flex-shrink-0 hidden w-10 py-2 text-center rounded-l sm:block">
                    {/* Upvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames("icon-arrow-up", {
                          "text-red-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    {/* Downvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames("icon-arrow-down", {
                          "text-blue-600": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="w-full py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post Pic */}
                    <div>
                      <img src={post.imageUrl} className="mx-auto" />
                    </div>
                    {/* Post body */}
                    <p className="my-3 text-sm whitespace-pre-line ">
                      {post.body}
                    </p>
                    {/* Actions */}
                    <div className="flex">
                      <div
                        className="text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1)}
                      >
                        <i
                          className={classNames("m-1 icon-arrow-up fa-xs", {
                            "text-red-500": post.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="m-1 text-xs font-bold sm:hidden">
                        {post.voteScore}
                      </p>
                      {/* Downvote */}
                      <div
                        className="mr-2 text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-blue-600"
                        onClick={() => vote(-1)}
                      >
                        <i
                          className={classNames("m-1 icon-arrow-down fa-xs", {
                            "text-blue-600": post.userVote === -1,
                          })}
                        ></i>
                      </div>
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} comments
                            </span>
                          </ActionButton>
                        </a>
                      </Link>
                      <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                      </ActionButton>
                      <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                {/* Commnet input area */}
                <div className="pl-2 pr-2 mb-4 sm:pr-6 sm:pl-10">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={newComment.trim() === ""}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-between px-2 py-4 border border-gray-200 rounded sm:flex-row">
                      <p className="mb-4 font-semibold text-gray-400 sm:mb-0">
                        Log in or sign up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Login
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/* Commnets feed */}
                {comments?.map((comment) => (
                  <div
                    className="flex p-2 border-b sm:p-0 sm:border-none"
                    key={comment.identifier}
                  >
                    {/* Vote section */}
                    <div className="flex-shrink-0 hidden w-10 py-2 text-center rounded-l sm:block">
                      {/* Upvote */}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classNames("icon-arrow-up", {
                            "text-red-500": comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold">{comment.voteScore}</p>
                      {/* Downvote */}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classNames("icon-arrow-down", {
                            "text-blue-600": comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-0 pr-2 sm:py-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`${comment.voteScore}
                           points ???
                           ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                      <div className="flex mt-1 sm:hidden">
                        <div
                          className="text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-red-500"
                          onClick={() => vote(1, comment)}
                        >
                          <i
                            className={classNames("m-1 icon-arrow-up fa-xs", {
                              "text-red-500": comment.userVote === 1,
                            })}
                          ></i>
                        </div>
                        <p className="m-1 text-xs font-bold sm:hidden">
                          {comment.voteScore}
                        </p>
                        {/* Downvote */}
                        <div
                          className="mr-2 text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-blue-600"
                          onClick={() => vote(-1, comment)}
                        >
                          <i
                            className={classNames("m-1 icon-arrow-down fa-xs", {
                              "text-blue-600": comment.userVote === -1,
                            })}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
