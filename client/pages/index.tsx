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
import { getContext } from "../helper/context";

function Index() {
  const { state, dispatch, reducerActionTypes } = getContext();

  useEffect(() => {
    const newScoket = io(`http://localhost:4000`, {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
    });

    newScoket.on("on-connect", (info) => {
      dispatch({
        type: "LOGIN",
        payload: { ...info.userInfo, isAuth: true, socket: newScoket },
      });
    });

    newScoket.on("connect_error", (err) => {});

    newScoket.on("recieve-message", (message) => {
      dispatch({
        type: reducerActionTypes.ADD_MESSAGE,
        payload: { number: message.from, ...message },
      });
    });
  }, []);

  if (!state.isAuth) {
    return <div className="loading"></div>
  }

  return (
    <div className={styles.container}>
      {/* <AddContact /> */}
      <SideBar />
      <Contacts />
      {/* <Profile /> */}
      <Chats />
      {/* <ContactProfile /> */}
    </div>
  )
}
export default Index;
