import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  Dispatch,
} from "react";

import { User } from "./interfaces";

const reducerActionTypes = {
  LOGIN: "LOGIN",
  SELECTEDCONTACT: "SELECTED_CONTACT",
  ADD_MESSAGE: "ADD_MESSAGE",
};

const InitionsState = {
  socket: null,
  name: "",
  number: 0,
  profile: "",
  contacts: [],
  selectedContact: 0,
  isAuth: false,
};

interface ContextProps {
  state: User;
  dispatch: any;
  reducerActionTypes: typeof reducerActionTypes;
}

interface ReducerAction {
  type: String;
  payload: Object;
}

const Context = createContext<ContextProps>({
  state: InitionsState,
  dispatch: (action) => {},
  reducerActionTypes: reducerActionTypes,
});

const reducer = (state: User, action: ReducerAction) => {
  switch (action.type) {
    case reducerActionTypes.LOGIN:
      return { ...state, ...action.payload };
    case reducerActionTypes.SELECTEDCONTACT:
      return { ...state, selectedContact: action.payload.number };
    case reducerActionTypes.ADD_MESSAGE: {
      const updatedContacts = state.contacts.map((contact) => {

        if (contact.number === action.payload.number) {
          if (!contact.messages) {
            contact.messages = [];
          }
          return {
            ...contact,
            messages: [...contact.messages, action.payload],
          };
        }
        return contact;
      });
      return { ...state, contacts: updatedContacts };
    }
    default:
      throw new Error();
  }
};

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, InitionsState);
  return (
    <Context.Provider value={{ state, dispatch, reducerActionTypes }}>
      {children}
    </Context.Provider>
  );
}

export const getContext = () => useContext(Context);

export default ContextProvider;
