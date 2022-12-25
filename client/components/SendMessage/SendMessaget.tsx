import React, { useState, useRef } from "react";
import styles from "./css.module.css";
import dynamic from "next/dynamic";
import { AiOutlineFileImage } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { EmojiClickData } from "emoji-picker-react";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);
function SendMessage() {
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const [file, setFile] = useState(null);

  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onEmojiClick = (emojiObject: unknown) => {
    setMessage(`${message}${emojiObject}`);
  };

  const messageInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (messageInputRef.current != null) {
      messageInputRef.current.style.height = "auto";
      messageInputRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };
  return (
    <div className={styles.send_message}>
      <div className={styles.input_wrappe}>
        <textarea
          ref={messageInputRef}
          value={message}
          onChange={messageInputOnChange}
          placeholder="Send message"
          className={styles.message_input}
        />
        <div className={styles.ap_types}>
          <input ref={fileInputRef} type="file" className={styles.file_input} />
          <AiOutlineFileImage className={styles.icon} />
          <BsEmojiSmile
            className={styles.icon}
            onClick={() => setEmojiPicker(!emojiPicker)}
          />
          {emojiPicker && (
            <div className={styles.emoji_picker}>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>

      <button className={styles.send_btn}>
        <BiSend />
      </button>
    </div>
  );
}

export default SendMessage;
