import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "../components/navBar/navBar";
import Contacts from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
import Profile from "../components/profile/Profile";
import SidePopUpMessage from "../components/sidePopUpMessage.js/SidePopUPMessage";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { getContext } from "../helper/context";
import { useRouter } from "next/router";
import axios from "../helper/axios";

function Index() {
  const { state, dispatch, reducerActionTypes } = getContext();
  const [profile, setProfile] = useState<boolean>(false);
  const [reloadPage, setReloadPage] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/");
    }
    const socket = io("https://frchatbackend.fahis.live/", {
      auth: {
        token: localStorage.getItem("access_token"),
      },
    });

    socket.on("on-connect", (info) => {
      dispatch({
        type: "LOGIN",
        payload: { ...info.userInfo, isAuth: true, socket },
      });
    });

    socket.on("connect_error", async (err) => {
      if (err.message === "403") {
        const { data } = await axios.get("/user/refresh-token");
        if (data.status === "ok") {
          localStorage.setItem("access_token", data.accessToken);
          setReloadPage(!reloadPage);
          return;
        }
      }
      localStorage.removeItem("access_token");
      router.push("/login");
    });

    socket.on("recieve-message", async (message) => {
      const contactIn = state.contacts.find(
        (contact) => contact.number === message.from
      );
      if (contactIn) {
        dispatch({
          type: reducerActionTypes.ADD_MESSAGE,
          payload: { number: message.from, ...message },
        });
      } else {
        const { data } = await axios.post("/contact/add-contact", {
          number: message.from,
        });

        if (data.status === "ok") {
          dispatch({
            type: reducerActionTypes.ADD_CONTACT,
            payload: {
              contact: {
                ...data.contact,
                messages: [message],
              },
            },
          });
        }
      }
    });

    socket.on("user-online", (number) => {
      dispatch({
        type: reducerActionTypes.CHANGE_USER_ONLINE_STATUS,
        payload: { status: true, number },
      });
    });
    socket.on("user-offline", (number) => {
      dispatch({
        type: reducerActionTypes.CHANGE_USER_ONLINE_STATUS,
        payload: { status: false, number },
      });
    });
  }, [reloadPage]);

  return (
    <>
      <Head>
        <title>FrChat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="FRChat is a simple and easy to use chat application for connecting with friends and family"
        />
        <meta name="keywords" content="chat, friends, family, FRChat" />
      </Head>
      {!state.socket ? (
        <div className="loadings">
          <span className="loading">Contact</span>
        </div>
      ) : (
        <div
          className={styles.container}
          data-theme={state.darkTheme.toString()}
        >
          <SidePopUpMessage />
          <NavBar setProfileTrigger={setProfile} />
          <main className={styles.main}>
            <div className={styles.contacts_info}>
              <Contacts />
              <Profile setTrigger={setProfile} trigger={profile} />
            </div>
            <Chats />
          </main>
        </div>
      )}
    </>
  );
}
export default Index;
