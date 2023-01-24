import styles from "./css.module.scss";
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import SendMessage from "../SendMessage/SendMessaget";
import Image from "next/image";
import { getContext } from "../../helper/context";
import ContactProfile from "../profile/ContactProfile";
import { getProfileUrl } from "../../helper/axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import Messages from "../messages/Messages";

function Chats() {
  const { state, dispatch, reducerActionTypes } = getContext();
  const [contactProfile, setContactProfile] = useState<boolean>(false);

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
              <span>{contact.name ?? contact.number}</span>
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
        <Messages contact={contact} />
        <SendMessage />
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
