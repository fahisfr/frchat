import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./css.module.css";
import { FiSettings } from "react-icons/fi";
import { AiOutlineHome, AiOutlineUserAdd } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import AddContact from "../addContact/AddContact";
import { profileUrl } from "../../helper/axios";
import { getContext } from "../../helper/context";

interface SideBarProps {
  setProfileTrigger: Dispatch<SetStateAction<boolean>>;
}

function SideBar({ setProfileTrigger }: SideBarProps) {
  const { state } = getContext();
  const [addContact, setAddContact] = useState(false);

  return (
    <div className={styles.sidebar_container}>
      {addContact && <AddContact setTrigger={setAddContact} />}
      <div className={styles.wb_logo}>
        <Image fill alt="" className="rounded-full" src="/frlogo.png" />
      </div>
      <div className={styles.options}>
        <div className={styles.group}>
          <AiOutlineHome className={styles.icons} />
        </div>
        <div
          className={styles.group}
          onClick={() => setProfileTrigger((state) => !state)}
        >
          <CgProfile className={styles.icons} />
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
          src={`${profileUrl}/${state.profile}`}
        />
      </div>
    </div>
  );
}

export default SideBar;
