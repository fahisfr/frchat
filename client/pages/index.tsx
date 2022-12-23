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

function Index() {
  const [socket, setScket] = useState({});
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    const newScoket = io(`http://localhost:4000`, {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
    });

    newScoket.on("on-connect", (user) => {
      setUserInfo(user);
    });

    newScoket.on("connect_error", (err) => {
      alert("faild to connect")
    });
  }, []);
  return (
    <div className={styles.container}>
      {/* <AddContact /> */}
      <SideBar  />
      <Contacts />
      {/* <Profile /> */}
      <Chats />
      {/* <ContactProfile /> */}
    </div>
  );
}
export default Index;
