"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { useUser } from "../_context/userContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const { setUser } = useUser();

  const loginUser = async (e) => {
    e.preventDefault();
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setUser(data);
      router.push("/");
    }
  };

  return (
    <div className="w-[400px]">
      <h1 className="font-bold text-3xl my-2">Login</h1>
      <Form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="username">Email Address</label>
          <input
            id="email"
            type="text"
            className="border-2 rounded-sm"
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
            className="border-2 rounded-sm"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          className="w-full text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]"
          onClick={loginUser}
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
      </Form>
    </div>
  );
};

export default LoginPage;
