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
  onlineStatus: boolean;
  messages: Message[];
}

export interface User {
  socket: Socket | null;
  name: string;
  number: number;
  profile: string;
  contacts: Contact[];
  selectedContact: number;
  isAuth: boolean;
}

export interface Trigger {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}
