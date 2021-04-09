import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import Axios from "axios";

import { Post } from "../types";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import ActionButton from "./ActionButton";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
  },
}: PostCardProps) {
  const router = useRouter();
  const { authenticated } = useAuthState();

  const vote = async (value: number) => {
    // If note logged in goto login
    if (!authenticated) router.push("/login");

    // If vote is the same reset vote
    if (value === userVote) value = 0;
    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div key={identifier} className="flex mb-4 bg-white rounded shadow-md">
      {/* Vote section */}
      <div className="hidden w-10 py-3 text-center bg-gray-200 rounded-l sm:block">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold hover:underline">/r/{subName}</a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <div
            className="text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-red-500"
            onClick={() => vote(1)}
          >
            <i
              className={classNames("m-1 icon-arrow-up fa-xs", {
                "text-red-500": userVote === 1,
              })}
            ></i>
          </div>
          <p className="m-1 text-xs font-bold sm:hidden">{voteScore}</p>
          {/* Downvote */}
          <div
            className="mr-2 text-gray-400 rounded cursor-pointer sm:hidden hover:bg-gray-300 hover:text-blue-600"
            onClick={() => vote(-1)}
          >
            <i
              className={classNames("m-1 icon-arrow-down fa-xs", {
                "text-blue-600": userVote === -1,
              })}
            ></i>
          </div>
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} comments</span>
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
  );
}
