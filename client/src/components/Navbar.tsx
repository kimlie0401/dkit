import Axios from "axios";
import Link from "next/link";
import { Fragment } from "react";

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
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <DkitLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">Dkit</Link>
        </span>
      </div>
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white ">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
          placeholder="Search"
        />
      </div>
      {/* Auth buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="py-1 mr-4 leading-5 w-28 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="py-1 mr-4 leading-5 w-28 hollow blue button ">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="py-1 leading-5 w-28 blue button ">Sign up</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
