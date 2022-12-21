import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import SideBar from "../components/sideBar/SideBar";
import Contacts from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
import Profile from "../components/profile/Profile";
import ContactProfile from "../components/profile/ContactProfile";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { convertToObject } from "typescript";

function Index() {
  const [socket, setScket] = useState({});

  useEffect(() => {
    const ioSocket = io(`http://localhost:4000`, {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
    });
    
    ioSocket.on("open", () => {
alert("yes is work")
      setScket(ioSocket);

    });

    ioSocket.on("connect_error", (err) => {
      console.log(err.message); // prints the message associated with the error
    });
  }, []);
  return (
    <div className={styles.container}>
      <SideBar />
      <Contacts />
      {/* <Profile /> */}
      <Chats />
      {/* <ContactProfile /> */}
    </div>
  );
}
export default Index;
