import React, { useEffect, useRef, useState } from "react";
import getDate from "../../helper/getDate";
import { getProfileUrl } from "../../helper/axios";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import styles from "./css.module.css";
import { Contact } from "../../helper/interfaces";
import { getContext } from "../../helper/context";
import Image from "next/image";

export default function Messages({ contact }: { contact: Contact }) {

  const { state } = getContext();
  const endMessageRef = useRef<HTMLDivElement>(null);
  const downArrowRef = useRef<HTMLHRElement>(null);
  const [scrollDownButton, setScrollDownButton] = useState<boolean>(false);

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

  useEffect(() => scrollToBottom());
  const messageSortByDate = () => {
    return contact?.messages.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
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
        {messageSortByDate().map((message, index) => {
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
        {contact.typingStatus && (
          <div className={`${styles.message_content} ${styles.dots_loading}`}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        <div ref={endMessageRef}></div>
      </div>

      <BsFillArrowDownCircleFill
        onClick={() => scrollToBottom()}
        className={styles.scroll_down_btn}
      />
    </div>
  );
}
