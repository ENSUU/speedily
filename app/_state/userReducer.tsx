import { User, UserAction } from "../types";

export const userReducer = (state: User, action: UserAction): User => {
  switch (action.type) {
    case "Login":
      return {
        ...state,
        user_id: action.payload.user_id,
        email: action.payload.email,
      };
    case "Logout":
      return {
        ...state,
        user_id: null,
        email: "",
      };
    default:
      return state;
  }
};
