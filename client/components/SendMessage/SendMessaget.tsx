import React, { useState, useRef } from "react";
import styles from "./css.module.css";
import dynamic from "next/dynamic";
import { BsEmojiSmile } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { getContext } from "../../helper/context";
import clickOutside from "../../helper/clickOutSide";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

interface SendMessageProps {
  scrollToBottom: () => void;
}

function SendMessage({ scrollToBottom }: SendMessageProps) {
  const {
    state: { socket, number, selectedContact },
    dispatch,
    reducerActionTypes,
  } = getContext();


  const [emojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef(null);

  clickOutside(emojiPickerRef, () => setEmojiPicker(false));

  const sendMessage = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent
  ) => {
    e.preventDefault();

    if (socket === null) return;

    socket.emit("send-message", { text, to: selectedContact });

    dispatch({
      type: reducerActionTypes.ADD_MESSAGE,
      payload: {
        number: selectedContact,
        text,
        from: number,
        date: new Date().toISOString(),
      },
    });

    setText("");
    scrollToBottom();
  };

  const onEmojiClick = (emojiObject: any) => {
    setText(`${text}${emojiObject.emoji}`);
  };

  const messageInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (messageInputRef.current != null) {
      messageInputRef.current.style.height = "auto";
      messageInputRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };
  return (
    <form className={styles.send_message} onSubmit={sendMessage}>
      <div className={styles.input_wrappe}>
        <textarea
          ref={messageInputRef}
          value={text}
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={messageInputOnChange}
          placeholder="Send a message"
          className={styles.message_input}
        />
        <div className={styles.ap_types}>
          <BsEmojiSmile
            className={styles.icon}
            onClick={() => setEmojiPicker(!emojiPicker)}
          />
          {emojiPicker && (
            <div ref={emojiPickerRef} className={styles.emoji_picker}>
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
