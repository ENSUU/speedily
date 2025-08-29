"use client";

import { userInitialState } from "../_state/initialState";
import { Dispatch, ReactNode, useReducer } from "react";
import { userReducer } from "../_state/userReducer";
import { createContext, useContext } from "react";
import { User, UserAction } from "../types";

const UserContext = createContext<{
  userState: User;
  dispatch: Dispatch<UserAction>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, dispatch] = useReducer(userReducer, userInitialState);

  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser needs to be used inside UserProvider.");
  }
  return context;
}
