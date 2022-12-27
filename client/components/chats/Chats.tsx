import styles from "./css.module.css";
import React from "react";
import { faker } from "@faker-js/faker";
import { FiArrowLeft } from "react-icons/fi";
import SendMessage from "../SendMessage/SendMessaget";
import Image from "next/image";
import { getContext } from "../../helper/context";

function Chats() {
  const { state } = getContext();

  if (!state.selectedContact) {
    return <div></div>;
  }

  const contact = state.contacts.find(
    (contact) => contact.number === state.selectedContact
  );

  return (
    <div className={styles.chats}>
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
          <span>{contact?.name}</span>
        </div>
      </div>

      <div className={styles.messages}>
        {contact?.messages?.map((message, index) => {
          return message.from == state.number ? (
            <div className={`${styles.own_message}`} key={index}>
              <div className={styles.message_wrapper}>
                <div className={styles.message_details}>
                  <div>
                    <span className={styles.message_date}>2015-01-05</span>
                  </div>
                </div>
                <div className={`${styles.own_message_text_wrapper}`}>
                  <span className={styles.message_text}>{message.text}</span>
                </div>
              </div>
            </div>
          ) : (
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
                  <span className={styles.message_text}>{message.text}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SendMessage to={contact?.number} />
    </div>
  );
}

export default Chats;
