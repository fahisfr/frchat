import { Socket } from "socket.io-client";

export interface Message {
  from: String;
  text: String;
  date: Date;
  number?: Number;
}

export interface Contact {
  name: String;
  number: Number;
  profile: String;
  messages: Message[];
}

export interface User {
  socket: Socket | null;
  name: String;
  number: Number;
  profile: String;
  contacts: Contact[];
  selectedContact: Number;
  isAuth: Boolean;
}
