import React, { useState } from "react";
import styles from "./css.module.css";
import { faker } from "@faker-js/faker";
import { FiSettings } from "react-icons/fi";
import { AiOutlineHome, AiOutlineUserAdd } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import AddContact from "../addContact/AddContact";

function SideBar() {
  const [addContact, setAddContact] = useState(false);
  return (
    <div className={styles.container}>
      {addContact && <AddContact setTrigger={setAddContact} />}
      <div className={styles.wb_logo}>
        <Image fill alt="" className="rounded-full" src="/frlogo.png" />
      </div>
      <div className={styles.options}>
        <div className={styles.group}>
          <AiOutlineHome className={styles.icons} />
        </div>
        <div className={styles.group}>
          <CgProfile className={styles.icons} />
        </div>{" "}
        <div className={styles.group}>
          <FiSettings className={styles.icons} />
        </div>
        <div className={styles.group}>
          <AiOutlineUserAdd
            onClick={(e) => setAddContact(!addContact)}
            className={styles.icons}
          />
        </div>
      </div>{" "}
      <div className={styles.profile}>
        <Image
          fill
          alt=""
          className="rounded-full"
          src={faker.image.avatar()}
        />
      </div>
    </div>
  );
}

export default SideBar;
