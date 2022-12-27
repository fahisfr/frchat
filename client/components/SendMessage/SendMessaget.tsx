import React, { useState, useRef } from "react";
import styles from "./css.module.css";
import dynamic from "next/dynamic";
import { AiOutlineFileImage } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { getContext } from "../../helper/context";
const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);
function SendMessage({ to }: { to: Number }) {
  const {
    state: { socket, number },
    dispatch,
    reducerActionTypes,
  } = getContext();

  const [emojiPicker, setEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("send-message", { text, to });
    dispatch({
      type: reducerActionTypes.ADD_MESSAGE,
      payload: {
        number: to,
        text,
        from: number,
        date: new Date(),
      },
    });
    setText("");
  };

  const onEmojiClick = (emojiObject: unknown) => {
    setText(`${text}${emojiObject}`);
  };

  const messageInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (messageInputRef.current != null) {
      messageInputRef.current.style.height = "auto";
      messageInputRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  return (
    <form className={styles.send_message} onSubmit={sendMessage}>
      <div className={styles.input_wrappe}>
        <textarea
          ref={messageInputRef}
          value={text}
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

      <button type="submit" className={styles.send_btn}>
        <BiSend />
      </button>
    </form>
  );
}

export default SendMessage;
