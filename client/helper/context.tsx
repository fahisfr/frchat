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
  CHANGE_USER_ONLINE_STATUS: "CHANGE_USER_ONLINE_STATUS",
};

const InitionsState = {
  socket: null,
  name: "",
  number: 111111,
  profile: "",
  contacts: [],
  selectedContact: 1234567899,
  isAuth: false,
};

interface ContextProps {
  state: User;
  dispatch: any;
  reducerActionTypes: typeof reducerActionTypes;
}

interface Payload {
  number: number;
  status: boolean;
}

interface ReducerAction extends User {
  type: string;
  payload: Payload;
}

const Context = createContext<ContextProps>({
  state: InitionsState,
  dispatch: (action: any) => {},
  reducerActionTypes: reducerActionTypes,
});

const reducer = (state: User, { type, payload }: ReducerAction) => {
  switch (type) {
    case reducerActionTypes.LOGIN:
      return { ...state, ...payload };
    case reducerActionTypes.SELECTEDCONTACT:
      return { ...state, selectedContact: payload.number };
    case reducerActionTypes.ADD_MESSAGE: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          if (!contact.messages) {
            contact.messages = [];
          }
          return {
            ...contact,
            messages: [...contact.messages, payload],
          };
        }
        return contact;
      });
      return { ...state, contacts: updatedContacts };
    }
    case reducerActionTypes.CHANGE_USER_ONLINE_STATUS: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          return {
            ...contact,
            onlineStatus: payload.status,
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
  const [state, dispatch] = useReducer(reducer,InitionsState);
  return (
    <Context.Provider value={{ state, dispatch, reducerActionTypes }}>
      {children}
    </Context.Provider>
  );
}

export const getContext = () => useContext(Context);

export default ContextProvider;
