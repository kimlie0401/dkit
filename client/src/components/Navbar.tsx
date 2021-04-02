import Axios from "axios";
import Link from "next/link";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";

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
  const inputRef = useRef<HTMLInputElement>();

  useOnClickOutside(inputRef, () => setButtonToggle(false));

  function useOnClickOutside(inputRef: any, handler: any) {
    useEffect(() => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!inputRef.current || inputRef.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      // document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        // document.removeEventListener("touchstart", listener);
      };
    }, [inputRef, handler]);
  }

  return (
    <div ref={inputRef}>
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white shadow-md">
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
        <div className="hidden max-w-full px-4 w-160 sm:block">
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
          <button
            type="button"
            className="py-1 focus:outline-none"
            onClick={() => setButtonToggle(!buttonToggle)}
          >
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
      <Transition
        show={buttonToggle}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* <div
          className="fixed z-20 py-1 mt-2 origin-top-right bg-gray-200 rounded-md shadow-lg w-30 right-2 top-8 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {!loading &&
            (authenticated ? (
              <a
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={logout}
              >
                Logout
              </a>
            ) : (
              <Fragment>
                <Link href="/login">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Log in
                  </a>
                </Link>
                <Link href="/register">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign up
                  </a>
                </Link>
              </Fragment>
            ))}
        </div> */}
        <div className="sm:hidden">
          <div className="fixed inset-x-0 z-10 flex-col items-center justify-center p-2 bg-white border-t shadow-md top-12">
            <div className="max-w-full px-4 my-2 w-160">
              <div className="flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white ">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                <input
                  type="text"
                  className="py-1 pr-3 bg-transparent rounded focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </div>
            {!loading &&
              (authenticated ? (
                <div className="flex justify-center">
                  <button
                    className="w-20 py-1 mr-4 leading-5 lg:w-28 hollow blue button"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex justify-center py-1 my-1">
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
                </div>
              ))}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Navbar;
