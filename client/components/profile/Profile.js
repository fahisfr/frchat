import React from "react";
import styles from "./css.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { faker } from "@faker-js/faker";
function Profile() {
  return (
    <div className={styles.profile}>
      <div className={styles.pf_top}>
        <div>
          <FiArrowLeft size={30} />
        </div>
        <div>
          <span className={styles.pf_title}>Profile</span>
        </div>
      </div>
      <div className={styles.pf_body}>
        <div className={styles.pf_info}>
          <div className={styles.pf_profile}>
            <Image
              fill
              alt=""
              className="rounded-full"
              src={faker.image.avatar()}
            />
          </div>
          <div className={styles.pf_number}>
            <span>{faker.phone.phoneNumber("+91 ##########")}</span>
          </div>
        </div>
      </div>
      <div className={styles.pf_edit}>
        <label className={styles.pf_label}>Name</label>
        <input
          className={styles.pf_name_input}
          placeholder="Enter your name"
        ></input>
      </div>
    </div>
  );
}

export default Profile;
