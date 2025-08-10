import { supabase } from "../../../supabaseClient";

export const dynamic = "force-static"; // Used for caching.

// Get all user information.
export async function GET() {
  const { data, error } = await supabase.from("users").select("*");
  console.log(data);
  if (error) {
    console.error(error);
  } else {
    return data;
  }
  return Response.json({ data });
}
