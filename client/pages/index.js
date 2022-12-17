import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import SideBar from "../components/sideBar/SideBar";
import Contacts from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
import Profile from "../components/profile/Profile";
import ContactProfile from "../components/profile/ContactProfile";
function Index() {
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
