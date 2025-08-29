"use client";

import { supabase } from "@/supabaseClient";

import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const createUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <div className="w-[400px]">
      <h1 className="font-bold text-3xl my-2">Sign Up</h1>
      <Form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="text"
            className="border-2 rounded-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="border-2 rounded-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-2 rounded-sm"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {!passwordsMatch && (
          <p className="text-red-600">Passwords do not match!</p>
        )}
        {errorMessage != "" && <p className="text-red-600">{errorMessage}</p>}
        <button
          className="w-full text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]"
          onClick={createUser}
        >
          Sign Up
        </button>
        <p>
          Already have an account? Log in{" "}
          <Link href="login" className="text-blue-500">
            here.
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignupPage;
