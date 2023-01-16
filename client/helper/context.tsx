import { createContext, useContext, ReactNode, useReducer } from "react";

import { User } from "./interfaces";
import reducer, { reducerActionTypes } from "./reducerActions";

const InitionsState = {
  socket: null,
  number: 0,
  profile: "",
  contacts: [],
  about: "",
  selectedContactNumber: 0,
  isAuth: false,
  darkTheme:
    typeof window !== "undefined" &&
    localStorage.getItem("darkTheme") === "true"
      ? true
      : false,
  sidePopUpMessage: {
    trigger: false,
    error: false,
    message: "",
  },
};

interface ContextProps {
  state: User;
  dispatch: any;
  reducerActionTypes: typeof reducerActionTypes;
}

const Context = createContext<ContextProps>({
  state: InitionsState,
  dispatch: (action: any) => {},
  reducerActionTypes: reducerActionTypes,
});

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, InitionsState);

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        reducerActionTypes,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const getContext = () => useContext(Context);

export default ContextProvider;
