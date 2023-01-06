import React, { useEffect, useRef } from "react";
import styles from "./css.module.css";
import { BiError } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { getContext } from "../../helper/context";

function SidePopUPMessage() {
  const {
    state: { sidePopUpMessage },
    dispatch,
    reducerActionTypes,
  } = getContext();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sidePopUpMessage.trigger) {
      timerRef.current = setTimeout(closePopUpMessage, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sidePopUpMessage.trigger]);

  function closePopUpMessage() {
    dispatch({ type: reducerActionTypes.CLOSE_SIDE_POPUP_MESSAGE });
  }
  return (
    <div
      className={`${styles.side_popup} ${
        sidePopUpMessage.trigger ? styles.sb_on : styles.sb_colse
      } `}
      style={{
        backgroundColor: `${sidePopUpMessage.error ? "red" : "green"} `,
      }}
    >
      <div className={styles.sp_body}>
        {sidePopUpMessage.error ? (
          <BiError className={styles.sp_icon_error} />
        ) : (
          <BsCheckCircle className={styles.sp_icon_success} />
        )}

        <span className={styles.sp_message}>{sidePopUpMessage.message}</span>
        <IoMdClose
          size={20}
          onClick={closePopUpMessage}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default SidePopUPMessage;
