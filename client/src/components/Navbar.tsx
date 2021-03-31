import Axios from "axios";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import classNames from "classnames";

import { useAuthState, useAuthDispatch } from "../context/auth";

import DkitLogo from "../images/dkit.svg";

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const [buttonToggle, setButtonToggle] = useState(false);

  const toggleHandler = () => {
    setButtonToggle((prev) => !prev);
  };

  return (
    <Fragment>
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
        <div className="flex items-center">
          <Link href="/">
            <a>
              <DkitLogo className="w-8 h-8 mr-2" />
            </a>
          </Link>
          <span className="hidden text-2xl font-semibold lg:block">
            <Link href="/">Dkit</Link>
          </span>
        </div>
        <div className="max-w-full px-4 w-160">
          <div className="flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white ">
            <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
            <input
              type="text"
              className="py-1 pr-3 bg-transparent rounded focus:outline-none"
              placeholder="Search"
            />
          </div>
        </div>
        {/* Auth buttons */}
        <div className="flex">
          {!loading &&
            (authenticated ? (
              <button
                className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-28 hollow blue button"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <Fragment>
                <Link href="/login">
                  <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-28 hollow blue button ">
                    Log in
                  </a>
                </Link>
                <Link href="/register">
                  <a className="hidden w-20 py-1 leading-5 sm:block lg:w-28 blue button ">
                    Sign up
                  </a>
                </Link>
              </Fragment>
            ))}
        </div>
        <div className="sm:hidden">
          <button className="py-1" onClick={toggleHandler}>
            <svg
              className="w-6 h-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* mobile menu */}
      <div className={buttonToggle ? "block" : "hidden"}>
        <div className="fixed inset-x-0 z-10 flex items-center justify-center p-2 bg-white top-12">
          {!loading &&
            (authenticated ? (
              <button
                className="w-20 py-1 mr-4 leading-5 lg:w-28 hollow blue button"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <Fragment>
                <Link href="/login">
                  <a className="w-20 py-1 mr-4 leading-5 lg:w-28 hollow blue button">
                    Log in
                  </a>
                </Link>
                <Link href="/register">
                  <a className="w-20 py-1 leading-5 lg:w-28 blue button">
                    Sign up
                  </a>
                </Link>
              </Fragment>
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
