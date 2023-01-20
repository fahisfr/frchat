import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "../components/navBar/navBar";
import Contacts from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
import Profile from "../components/profile/Profile";
import axios from "../helper/axios";
import io from "socket.io-client";
import SidePopUPMessage from "../components/sidePopUpMessage.js/SidePopUPMessage";
import { useEffect, useState } from "react";
import { getContext } from "../helper/context";
import { useRouter } from "next/router";
import { TbPlugConnectedX } from "react-icons/tb";

const wsUrl = "https://frchat.fahis.live/";

function Index() {
  const { state, dispatch, reducerActionTypes } = getContext();
  const [profile, setProfile] = useState<boolean>(false);
  const [wsReRequest, SetWsReRequest] = useState<boolean>(false);
  const [wsError, setWsError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const socket = io(wsUrl, { auth: { token } });
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
          SetWsReRequest(!wsReRequest);
          return;
        }
      } else if (err.message === "401") {
        localStorage.removeItem("access_token");
        router.push("/login");
      } else {
        setWsError(
          "We apologize for the inconvenience, the server is currently unavailable. Please check back later"
        );
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
  }, [wsReRequest]);

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
      {wsError ? (
        <div className="full_center">
          <TbPlugConnectedX className={styles.icon_plug} />
          <span>{wsError}</span>
        </div>
      ) : !state.socket ? (
        <div className="full_center">
          <span className="loading"></span>
        </div>
      ) : (
        <div
          className={styles.container}
          data-theme={state.darkTheme.toString()}
        >
          <SidePopUPMessage />
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
