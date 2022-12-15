import React from "react";
import styles from "./css.module.css";
import { faker } from "@faker-js/faker";
import { FiSettings } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

function SideBar() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.profile}>
          <img className={styles.profile_img} src={faker.image.avatar()} />
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.group}>
          <AiOutlineHome className={styles.icons} />
        </div>
        <div className={styles.group}>
          <CgProfile className={styles.icons} />
        </div>{" "}
        <div className={styles.group}>
          <FiSettings className={styles.icons} />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
