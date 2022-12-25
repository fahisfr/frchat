import { createContext, useContext, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const userInitionsState = {
  name: "",
  number: 0,
  profile: "",
  contacts: [],
  isAuth: false,
};

interface User {
  name: string;
  number: Number;
  profile: string;
  contacts: never[];
  isAuth: Boolean;
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  socket: Socket;
  setSocket: React.Dispatch<React.SetStateAction<Socket>>;
  selectedContact: Number | null;
  setSelectedContact: React.Dispatch<React.SetStateAction<Number | null>>;
}

const UserContext = createContext<UserContextProps>({
  user: userInitionsState,
  setUser: () => {},
  socket: io(),
  setSocket: () => {},
  selectedContact: null,
  setSelectedContact: () => {},
});

function Context({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(userInitionsState);
  const [socket, setSocket] = useState<Socket>(io());
  const [selectedContact, setSelectedContact] = useState<Number | null>(null);
  return (
    <UserContext.Provider
      value={{
        socket,
        setSocket,
        user,
        setUser,
        selectedContact,
        setSelectedContact,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const userState = () => useContext(UserContext);

export default Context;
