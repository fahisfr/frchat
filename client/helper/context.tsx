import { createContext, useContext, ReactNode, useReducer } from "react";

import { TriggerSidePopUpMessage, User } from "./interfaces";
import reducer, { reducerActionTypes } from "./reducerActions";

const InitionsState = {
  socket: null,
  name: "",
  number: 111111,
  profile: "",
  contacts: [],
  about: "",
  selectedContact: 0,
  isAuth: false,
  darkTheme: true,
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
  triggerSidePopUpMessage: (arg: TriggerSidePopUpMessage) => void;
}

const Context = createContext<ContextProps>({
  state: InitionsState,
  dispatch: (action: any) => {},
  reducerActionTypes: reducerActionTypes,
  triggerSidePopUpMessage: () => {},
});

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, InitionsState);

  const triggerSidePopUpMessage = (arg: TriggerSidePopUpMessage) => {
    dispatch({
      type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
      payload: arg,
    });
  };

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        reducerActionTypes,
        triggerSidePopUpMessage,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const getContext = () => useContext(Context);

export default ContextProvider;
