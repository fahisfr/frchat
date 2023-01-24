import { User } from "./interfaces";
interface ReducerAction extends User {
  type: string;
  payload: any;
}

export const reducerActionTypes = {
  LOGIN: "LOGIN",
  SELECT_CONTACT: "SELECT_CONTACT",
  ADD_MESSAGE: "ADD_MESSAGE",
  CHANGE_CONTACT_ONLINE_STATUS: "CHANGE_CONTACT_ONLINE_STATUS",
  CHANGE_CONTACT_TYPING_STATUS: "CHANGE_CONTACT_TYPING_STATSU",
  CHANGE_THEME: "CHANGE_THEME",
  CHANGE_CONTACT_NAME: "CHANGE_CONTACT_NAME",
  REMOVE_CONTACT: "REMOVE_CONTACT",
  ADD_CONTACT: "ADD_CONTACT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  TRIGGER_SIDE_POPUP_MESSAGE: "TRIGGER_SUCCESS_SIDE_POPUP_MESSAGE",
  CLOSE_SIDE_POPUP_MESSAGE: "CLOSE_SIDE_POPUP_MESSAGE",
};

export default (state: User, { type, payload }: ReducerAction) => {
  switch (type) {
    case reducerActionTypes.CHANGE_THEME:
      const themeStatus = !state.darkTheme;
      localStorage.setItem("darkTheme", themeStatus.toString());
      return {
        ...state,
        darkTheme: themeStatus,
      };
    case reducerActionTypes.LOGIN:
      return { ...state, ...payload };
    case reducerActionTypes.SELECT_CONTACT:
      return { ...state, selectedContactNumber: payload.number };

    case reducerActionTypes.ADD_MESSAGE: {
      let contactIn;
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          contactIn = true;
          return {
            ...contact,
            messages: [...contact.messages, payload],
          };
        }
        return contact;
      });
      if (contactIn) {
        return { ...state, contacts: updatedContacts };
      }
      return {
        ...state,
        contacts: [
          ...state.contacts,
          {
            number: payload.number,
            profile: "default_profile.jpg",
            onlineStatus: true,
            messages: [payload],
          },
        ],
      };
    }
    case reducerActionTypes.CHANGE_CONTACT_ONLINE_STATUS: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          return {
            ...contact,
            typingStatus: false,
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
          ...state.sidePopUpMessage,
          trigger: false,
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
        sidePopUpMessage: {
          trigger: true,
          error: false,
          message: payload.message,
        },
        contacts: updatedContacts,
      };
    }

    case reducerActionTypes.REMOVE_CONTACT: {
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.number !== payload.number
        ),
        sidePopUpMessage: {
          trigger: true,
          error: false,
          message: payload?.message,
        },
        selectedContactNumber:
          state.selectedContactNumber === payload.number
            ? 0
            : state.selectedContactNumber,
      };
    }

    case reducerActionTypes.ADD_CONTACT: {
      if (payload.selectContact) {
        return {
          ...state,
          selectedContactNumber: payload.contact.number,
          contacts: [...state.contacts, payload.contact],
        };
      }
      return {
        ...state,
        contacts: [...state.contacts, payload.contact],
      };
    }
    case reducerActionTypes.UPDATE_PROFILE: {
      return {
        ...state,
        ...payload.profile,
        sidePopUpMessage: {
          trigger: true,
          error: false,
          message: payload.message,
        },
      };
    }

    case reducerActionTypes.CHANGE_CONTACT_TYPING_STATUS: {
      const updatedContacts = state.contacts.map((contact) => {
        if (contact.number === payload.number) {
          return {
            ...contact,
            typingStatus: payload.status,
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
