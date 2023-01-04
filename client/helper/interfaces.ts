import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface Message {
  from: string;
  text: string;
  date: string;
  number?: number;
}

export interface Contact {
  name: string;
  number: number;
  profile: string;
  about: string;
  onlineStatus: boolean;
  messages: Message[];
}

export interface User {
  socket: Socket | null;
  name: string;
  number: number;
  profile: string;
  about: string;
  contacts: Contact[];
  selectedContact: number;
  isAuth: boolean;
  darkTheme: string;
}

export interface Trigger {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}
