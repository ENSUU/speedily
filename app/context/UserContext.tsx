import { createContext, useContext, useReducer } from "react";

const UserContext = createContext(null);

const userReducer = (state, action) => {
  switch (action.type) {
    case "login": {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case "logout": {
      return {
        ...state,
        user: null,
      };
    }
  }
};

export const UserContextProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, { user: null });

  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
