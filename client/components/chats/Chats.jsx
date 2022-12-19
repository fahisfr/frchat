import styles from "./css.module.css";
import React from "react";
import { faker } from "@faker-js/faker";
import { FiArrowLeft } from "react-icons/fi";
import SendMessage from "../SendMessage/SendMessage";
import Image from "next/image";
function Chats() {
  return (
    <div className={styles.chats_container}>
      <div className={styles.top}>
        <div className={styles.back_icon}>
          <FiArrowLeft size={32} />
        </div>
        <div className={styles.chat_contact_profile}>
          <Image
            fill
            alt=""
            className="rounded-full"
            src={faker.image.avatar()}
          />
        </div>
        <div className={styles.chat_contact_info}>
          <spna>{faker.internet.userName()}</spna>
        </div>
      </div>

      <div className={styles.messages}>
        <div className={`${styles.own_message}`}>
          <div className={styles.message_wrapper}>
            <div className={styles.message_details}>
              <div>
                <span className={styles.message_date}>2015-01-05</span>
              </div>
            </div>
            <div className={`${styles.own_message_text_wrapper}`}>
              <span className={styles.message_text}>
                {faker.lorem.paragraph(1)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.message_wrapper}>
            <div className={styles.message_details}>
              <div className={styles.user_profile}>
                <Image
                  fill
                  alt=""
                  className="rounded-full"
                  src={faker.image.avatar()}
                />
              </div>
              <div>
                <span className={styles.message_date}>2015-01-05</span>
              </div>
            </div>
            <div
              className={`${styles.contact_message_text_wrapper} ${styles.contact_message}`}
            >
              <span className={styles.message_text}>
                {faker.lorem.paragraph(12)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SendMessage />
    </div>
  );
}

export default Chats;
