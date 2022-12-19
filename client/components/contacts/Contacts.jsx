import React from "react";
import styles from "./css.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { faker } from "@faker-js/faker";
import Image from "next/image";
function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.search}>
          <label htmlFor={styles.search_input}>
            <AiOutlineSearch className={styles.search_icon} />
          </label>

          <input
            id={styles.search_input}
            className={styles.search_input}
            placeholder="Search contact"
          />
        </div>
      </div>
      <div className={styles.bottom}>
        {new Array(10).fill(0).map((item, index) => {
          return (
            <div className={styles.contact}>
              <div>
                <div className={styles.contact_profile}>
                  <Image
                    fill
                    alt=""
                    className="rounded-full"
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
                    <span className={styles.contact_message_date}>
                      {faker.datatype.number({ min: 5, max: 10 })}pm
                    </span>
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
          );
        })}
      </div>
    </div>
  );
}

export default Contact;
