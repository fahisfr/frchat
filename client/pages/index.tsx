import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "../components/navBar/navBar";
import Contacts from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
import Profile from "../components/profile/Profile";

import io from "socket.io-client";
import { useEffect, useState } from "react";
import { getContext } from "../helper/context";
import { User } from "../helper/interfaces";

function Index() {
  const { state, dispatch, reducerActionTypes } = getContext();
  const [profile, setProfile] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(`http://localhost:4000`, {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
    });

    socket.on("on-connect", (info) => {
      dispatch({
        type: "LOGIN",
        payload: { ...info.userInfo, isAuth: true, socket },
      });
      console.log(info);
    });

    socket.on("connect_error", (err) => {});

    socket.on("recieve-message", (message) => {
      dispatch({
        type: reducerActionTypes.ADD_MESSAGE,
        payload: { number: message.from, ...message },
      });
    });

    socket.on("user-online", (number) => {
      dispatch({
        type: reducerActionTypes.CHANGE_USER_ONLINE_STATUS,
        payload: { status: true, number },
      });
    });
    socket.on("user-oofline", (number) => {
      dispatch({
        type: reducerActionTypes.CHANGE_USER_ONLINE_STATUS,
        payload: { status: false, number },
      });
    });
  }, []);

  if (!state.isAuth) {
    return <div className="loading"></div>;
  }

  return (
    <div className={styles.container}>
      <NavBar setProfileTrigger={setProfile} />
      <main className={styles.main}>
        <div className={styles.contacts_info}>
          <Contacts />
          <Profile setTrigger={setProfile} trigger={profile} />
        </div>
        <Chats />
      </main>
    </div>
  );
}
export default Index;
