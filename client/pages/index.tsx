import { use, useContext } from "react";
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
import { userState } from "../helper/context";

function Index() {
  const { setSocket, user, setUser } = userState();
  console.log(user);
  useEffect(() => {
    const newScoket = io(`http://localhost:4000`, {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
    });

    newScoket.on("on-connect", (info) => {
      setSocket(newScoket);
      setUser({ ...info.userInfo, isAuth: true });
    });

    newScoket.on("connect_error", (err) => {});
  }, []);

  if (!user.isAuth) {
    return <div className="loading"></div>;
  }

  return (
    <div className={styles.container}>
      {/* <AddContact /> */}
      <SideBar />
      <Contacts />
      {/* <Profile /> */}
      {/* <Chats
      /> */}
      {/* <ContactProfile /> */}
    </div>
  );
}
export default Index;
