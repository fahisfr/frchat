import styles from "./css.module.css";
import React, { useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineFileImage } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { faker } from "@faker-js/faker";
import Index from "../../pages";
function Chats() {
  const [message, setMessage] = useState("");

  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const messageInputOnChange = (e) => {
    setMessage(e.target.value);
    messageInputRef.current.style.height = "auto";
    messageInputRef.current.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={styles.chats_container}>
      <div className={styles.top}></div>
      <div className={styles.messages}>
        {new Array(31).fill(0).map((item, index) => {
          return (
            <div className={styles.message }>
              <div className={styles.message_wrapper}>
                <div className={styles.message_details}>
                  <div className={styles.user_profile}>
                    <img
                      className={styles.user_profile_img}
                      src={faker.image.avatar()}
                    />
                  </div>{" "}
                  <div>
                    <span>2015-01-05</span>
                  </div>
                </div>
                <div className={styles.message_text_wrapper}>
                  <span className={styles.message_text}>
                    {" "}
                    {faker.lorem.paragraph(11)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>{" "}
      <div className={styles.bottom}>
        <div className={styles.input_wrappe}>
          <textarea
            rows="1"
            ref={messageInputRef}
            value={message}
            onChange={messageInputOnChange}
            type="text"
            placeholder="Send message"
            className={styles.message_input}
          />
          <div className={styles.ap_types}>
            <input
              ref={fileInputRef}
              type="file"
              className={styles.file_input}
            />
            <AiOutlineFileImage className={styles.icon} />
            <BsEmojiSmile className={styles.icon} />
          </div>
        </div>

        <button className={styles.send_btn}>
          <BiSend />
        </button>
      </div>
    </div>
  );
}

export default Chats;
