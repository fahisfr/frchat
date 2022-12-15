import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { faker } from "@faker-js/faker";

import SideBar from "../components/sideBar/SideBar";
import Contact from "../components/contacts/Contacts";
import Chats from "../components/chats/Chats";
function Index() {
  return (
    <div className={styles.container}>
      <SideBar />
      <Contact />
      <Chats />
    </div>
  );
}
export default Index;
