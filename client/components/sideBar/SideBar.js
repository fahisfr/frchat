import React from "react";
import styles from "./css.module.css";
import { faker } from "@faker-js/faker";
import { FiSettings } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

function SideBar() {
  return (
    <div className={styles.container}>
      <div className={styles.wb_logo}>
        <Image
          fill
          alt=""
          className="rounded-full"
          src="/frlogo.png"
        />
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
