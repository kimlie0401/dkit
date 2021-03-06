import React, { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
import { useAuthState } from "../context/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push("/");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree to T&Cs" });
      return;
    }
    if (email.trim().length === 0) {
      setErrors({
        ...errors,
        email: "Email is empty",
      });
      return;
    }

    if (username.trim().length < 3) {
      setErrors({
        ...errors,
        username: "Must be at least 3 characters long",
      });
      return;
    }

    if (password === "") {
      setErrors({
        ...errors,
        password: "Password must not be empty",
      });
      return;
    }

    if (confirmPassword === "") {
      setErrors({
        ...errors,
        confirmPassword: "Repeat password must not be empty",
      });
      return;
    }

    if (confirmPassword !== password) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords must match",
      });
      return;
    }

    try {
      await Axios.post("/auth/register", {
        email,
        password,
        username,
      });

      router.push("/login");

      // console.log(res.data);
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover md:w-36 sm:w-20"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/images/bricks.jpeg')`,
        }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get email about cool stuff on dkit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="Email"
              error={errors.email}
            />
            <InputGroup
              className="mb-2"
              type="text"
              value={username}
              setValue={setUsername}
              placeholder="Username"
              error={errors.username}
            />
            <InputGroup
              className="mb-2"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="Password"
              error={errors.password}
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              placeholder="Confirm Password"
              error={errors.confirmPassword}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a Dkitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
