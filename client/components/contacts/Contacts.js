import React from "react";
import styles from "./css.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { faker } from "@faker-js/faker";
function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.search}>
          <input className={styles.search_input} placeholder="Search contact" />
          <AiOutlineSearch className={styles.search_icon} />
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.contact}>
          <div>
            <div className={styles.contact_profile}>
              <img
                className={styles.contact_profile_img}
                src={faker.image.avatar()}
              />
            </div>
          </div>
          <div className={styles.contact_info}>
            <div className={styles.contact_info_top}>
              <div>
                <span>{faker.internet.userName()}</span>
              </div>
              <div>
                <span>{faker.datatype.number({ min: 5, max: 10 })}pm</span>
              </div>
            </div>
            <div className={styles.contact_info_bottom}>
              <div>
                <span className={styles.contact_last_message}>
                  {faker.lorem.paragraph()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
