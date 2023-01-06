import { User } from "./interfaces";

interface ReducerAction extends User {
  type: string;
  payload: any;
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

  TRIGGER_SIDE_POPUP_MESSAGE: "TRIGGER_SUCCESS_SIDE_POPUP_MESSAGE",
  CLOSE_SIDE_POPUP_MESSAGE: "CLOSE_SIDE_POPUP_MESSAGE",
};

export default (state: User, { type, payload }: ReducerAction) => {
  switch (type) {
    case reducerActionTypes.CHANGE_THEME:
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    case reducerActionTypes.LOGIN:
      return { ...state, ...payload };
    case reducerActionTypes.SELECTEDCONTACT:
      return { ...state, selectedContact: payload.number };

    case reducerActionTypes.ADD_MESSAGE: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
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

    case reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE:
      return {
        ...state,
        sidePopUpMessage: {
          trigger: true,
          error: payload.error,
          message: payload.message,
        },
      };
    case reducerActionTypes.CLOSE_SIDE_POPUP_MESSAGE: {
      return {
        ...state,
        sidePopUpMessage: {
          trigger: false,
          error: false,
          message: "",
        },
      };
    }

    case reducerActionTypes.CHANGE_CONTACT_NAME: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          contact.name = payload.name;
        }
        return contact;
      });

      return {
        ...state,
        contacts: updatedContacts,
      };
    }

    default:
      throw new Error();
  }
};
