import { User } from "./interfaces";

interface ReducerAction extends User {
  type: string;
  payload: Payload;
}
interface Payload {
  number: number;
  status: boolean;
}
export const reducerActionTypes = {
  LOGIN: "LOGIN",
  SELECTEDCONTACT: "SELECTED_CONTACT",
  ADD_MESSAGE: "ADD_MESSAGE",
  CHANGE_USER_ONLINE_STATUS: "CHANGE_USER_ONLINE_STATUS",
  CHANGE_THEME: "CHANGE_THEME",
  CHANGE_CONTACT_NAME: "CHANGE_CONTACT_NAME",
  REMOVE_CONTACT: "REMOVE_CONTACT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
};

export default (state: User, { type, payload }: ReducerAction) => {
  switch (type) {
    case reducerActionTypes.CHANGE_THEME:
      return {
        ...state,
        darkTheme: state.darkTheme === "true" ? "false" : "true",
      };
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
