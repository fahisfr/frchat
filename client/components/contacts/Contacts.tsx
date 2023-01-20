import React, { useState } from "react";
import styles from "./css.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import { profileUrl } from "../../helper/axios";
import { getContext } from "../../helper/context";
import getDate from "../../helper/getDate";

function Contacts() {
  const { state, dispatch, reducerActionTypes } = getContext();
  const [search, setSearch] = useState<string>("");
 
  return (
    <div className={styles.contacts_container}>
      <div className={styles.top}>
        <div className={styles.search}>
          <label htmlFor={styles.search_input}>
            <AiOutlineSearch className={styles.search_icon} />
          </label>

          <input
            id={styles.search_input}
            className={styles.search_input}
            placeholder="Search contact"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        {state.contacts?.length > 0 ? (
          state.contacts
            .filter((contact) => {
              if (!search) {
                return true;
              }
              return contact.name
                ?.toLowerCase()
                .startsWith(search.toLowerCase());
            })
            .map((contact, index) => {
              const messages = contact?.messages;
              const lastMessage = messages
                ?.reverse()
                .find((message) => message.from === contact.number);
              return (
                <div
                  className={styles.contact}
                  key={index}
                  onClick={() =>
                    dispatch({
                      type: reducerActionTypes.SELECT_CONTACT,
                      payload: { number: contact.number },
                    })
                  }
                >
                  <div>
                    <div className={styles.contact_profile}>
                      <Image
                        fill
                        alt=""
                        className={`rounded-full ${
                          contact.onlineStatus && "contact_is_online"
                        }`}
                        src={`${profileUrl}/${contact.profile}`}
                      />
                    </div>
                  </div>
                  <div className={styles.contact_info}>
                    <div className={styles.contact_info_top}>
                      <div className={styles.contact_name}>
                        <span>{contact.name ?? contact.number}</span>
                      </div>
                      <div>
                        <span className={styles.contact_message_date}>
                          {lastMessage ? getDate(lastMessage.date) : ""}
                        </span>
                      </div>
                    </div>
                    <div className={styles.contact_info_bottom}>
                      <div>
                        <span className={styles.contact_last_message}>
                          {lastMessage ? lastMessage.text : "no message"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className={styles.no_contacts}>
            <span>No Contacts </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;
