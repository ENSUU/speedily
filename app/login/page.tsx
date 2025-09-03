"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { FormEvent, useState } from "react";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useUser();

  const router = useRouter();

  const loginUser = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      dispatch({ type: "login", payload: data });
      router.push("/");
    }
  };

  return (
    <div className="w-[400px]">
      <h1 className="font-bold text-3xl my-2">Login</h1>
      <form id="loginForm" onSubmit={loginUser} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="username">Email Address</label>
          <input
            id="email"
            type="text"
            className="!border-b-1 !border-black"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="!border-b-1 !border-black"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          className="w-full text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]"
          type="submit"
          form="loginForm"
        >
          Log In
        </button>
        {errorMessage != "" && <p className="text-red-600">{errorMessage}</p>}
        <p>
          Don't have an account? Sign up{" "}
          <Link href="signup" className="text-blue-500">
            here.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
