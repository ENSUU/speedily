"use client";

import { supabase } from "../../supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/userContext";

import { useState } from "react";

const Navbar = () => {
  const router = useRouter();

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    const { err } = await supabase.auth.signOut();
    setUser(null);
    console.log("Logged out.");
    router.push("login");
  };

  return (
    <div
      id="navbar"
      className="w-dvw my-4 flex flex-col justify-center items-center gap-4"
    >
      <h1 className="text-4xl font-bold">Speedily</h1>
      {user != null && (
        <Link href="" onClick={handleLogout}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
