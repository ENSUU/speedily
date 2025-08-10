"use client";

import { supabase } from "../../supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { err } = await supabase.auth.signOut();
    setIsLoggedIn(false);
    console.log("Logged out.");
    router.push("login");
  };

  const getUserSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsLoggedIn(false);
      router.push("login");
    } else {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    getUserSession();
  }, [isLoggedIn]);

  return (
    <div
      id="navbar"
      className="w-dvw my-4 flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold">Speedily</h1>
      {isLoggedIn == true && (
        <Link href="" onClick={handleLogout}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
