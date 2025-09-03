"use client";

import { supabase } from "../../supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { userState, dispatch } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const { err } = await supabase.auth.signOut();
    dispatch({ type: "logout" });
    router.push("/login");
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  };
  getUser();

  return (
    <div
      id="navbar"
      className="w-dvw my-4 flex flex-col justify-center items-center gap-4"
    >
      <h1 className="text-4xl font-bold">Speedily</h1>
      {userState.user != null && (
        <Link href="" onClick={handleLogout}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
