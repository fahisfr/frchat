import styles from "./css.module.scss";
import React, { useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { FiArrowLeft } from "react-icons/fi";
import SendMessage from "../SendMessage/SendMessaget";
import Image from "next/image";
import { getContext } from "../../helper/context";
import getDate from "../../helper/getDate";
import ContactProfile from "../profile/ContactProfile";
import { getProfileUrl } from "../../helper/axios";
import { BsThreeDotsVertical } from "react-icons/bs";
function Chats() {
  const [contactProfile, setContactProfile] = useState<boolean>(false);
  const { state } = getContext();
  const bottomRef = useRef<HTMLDivElement>(null);
  if (!state.selectedContact) {
    return (
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
  const contact = state.contacts.find(
    (contact) => contact.number === state.selectedContact
  );

  return (
    <div className={styles.chats}>
      <div className={styles.contact_chats}>
        <div className={styles.top}>
          <div className={styles.back_icon}>
            <FiArrowLeft size={2} />
          </div>
          <div
            className={styles.chat_contact_profile}
          
          >
            <Image
              fill
              alt=""
              className="rounded-full"
              src={getProfileUrl(contact?.profile)}
            />
          </div>
          <div className={styles.chat_contact_info}>
            <span>{contact?.name}</span>
          </div>
          <div className={styles.contact_menu}  onClick={() => setContactProfile(!contactProfile)}>
            <BsThreeDotsVertical />
          </div>
        </div>

        <div className={styles.messages}>
          {contact?.messages.reverse().map((message, index) => {
            return message.from === state.number ? (
              <div className={`${styles.user_message} ${styles.message}`}>
                <div className={styles.message_wrapper}>
                  <div className={styles.message_details}>
                    <span className={styles.message_date}>
                      {getDate(message.date)}
                    </span>
                  </div>
                  <div className={styles.message_content}>
                    <span className={styles.message_text}>{message.text}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.message}>
                <div className={styles.message_wrapper}>
                  <div className={styles.message_details}>
                    <div className={styles.user_profile}>
                      <Image
                        fill
                        alt=""
                        className="rounded-full"
                        src={getProfileUrl(contact.profile)}
                      />
                    </div>
                    <span className={styles.message_date}>
                      {getDate(message.date)}
                    </span>
                  </div>{" "}
                  <div className={`${styles.message_content} theme-bg-text`}>
                    <span>{message.text}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>
        <SendMessage />
      </div>
      <ContactProfile trigger={contactProfile} setTrigger={setContactProfile} />
    </div>
  );
}

export default Chats;
