import styles from "./css.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import SendMessage from "../SendMessage/SendMessaget";
import Image from "next/image";
import { getContext } from "../../helper/context";
import getDate from "../../helper/getDate";
import ContactProfile from "../profile/ContactProfile";
import { getProfileUrl } from "../../helper/axios";
import { BsThreeDotsVertical, BsFillArrowDownCircleFill } from "react-icons/bs";

function Chats() {
  const [contactProfile, setContactProfile] = useState<boolean>(false);
  const { state, dispatch, reducerActionTypes } = getContext();
  const endMessageRef = useRef<HTMLDivElement>(null);
  const downArrowRef = useRef<HTMLHRElement>(null);
  const [scrollDownButton, setScrollDownButton] = useState<boolean>(false);

  useEffect(() => scrollToBottom());

  const contact = state.contacts?.find(
    (contact) => contact.number === state.selectedContactNumber
  );

  if (!contact) {
    return (
      <div className={styles.stc}>
        <div className={styles.stc_container}>
          <div className={styles.web_logo}>
            <Image src="/frlogo.png" fill alt="" />
          </div>
          <div>
            <span> Please select a contact to start chatting</span>
          </div>
        </div>
      </div>
    );
  }

  const backToContacts = () => {
    dispatch({
      type: reducerActionTypes.SELECT_CONTACT,
      payload: {
        number: 0,
      },
    });
  };

  const handleScroll = () => {
    if (downArrowRef.current != null) {
      const div = downArrowRef.current;

      const isAtBottom = div.scrollHeight - div.scrollTop === div.clientHeight;
      setScrollDownButton(!isAtBottom);
    }
  };
  function scrollToBottom() {
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView();
    }
  }

  

  return (
    <div className={styles.chats}>
      <div className={styles.contact_chats}>
        <div className={styles.top}>
          <div className={styles.top_left}>
            <div className={styles.back_icon} onClick={backToContacts}>
              <FiArrowLeft size={30} />
            </div>
            <div className={styles.chat_contact_profile}>
              <Image
                fill
                alt=""
                className={`rounded-full ${
                  contact?.onlineStatus && "contact_is_online"
                }`}
                src={getProfileUrl(contact?.profile)}
              />
            </div>
            <div className={styles.chat_contact_info}>
              <span>{contact?.name}</span>
            </div>
          </div>
          <div className={styles.top_right}>
            <div
              className={styles.contact_menu}
              onClick={() => setContactProfile(!contactProfile)}
            >
              <BsThreeDotsVertical size={25} />
            </div>
          </div>
        </div>
        <div
          className={`${styles.messages_container} ${
            scrollDownButton && styles.show_scroll_down_btn
          }`}
        >
          <div
            className={styles.messages}
            ref={downArrowRef}
            onScroll={handleScroll}
          >
            {contact?.messages
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
              })
              .map((message, index) => {
                return message.from === state.number ? (
                  <div
                    className={`${styles.user_message} ${styles.message}`}
                    key={index}
                  >
                    <div className={styles.message_wrapper}>
                      <div className={styles.message_details}>
                        <span className={styles.message_date}>
                          {getDate(message.date)}
                        </span>
                      </div>
                      <div className={styles.message_content}>
                        <span className={styles.message_text}>
                          {message.text}
                        </span>
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
                      <div
                        className={`${styles.message_content} theme-bg-text`}
                      >
                        <span>{message.text}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div ref={endMessageRef}></div>
          </div>

          <BsFillArrowDownCircleFill
            onClick={() => scrollToBottom()}
            className={styles.scroll_down_btn}
          />
        </div>

        <SendMessage scrollToBottom={scrollToBottom} />
      </div>

      <ContactProfile
        contact={contact}
        trigger={contactProfile}
        setTrigger={setContactProfile}
      />
    </div>
  );
}

export default Chats;
