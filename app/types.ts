export interface User {
  user_id: string | null;
  email: string;
}

export type UserAction = { type: "Login"; payload: User } | { type: "Logout" };
