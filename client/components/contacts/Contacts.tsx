import React from "react";
import styles from "./css.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import { profileUrl } from "../../helper/axios";
import { getContext } from "../../helper/context";

function Contacts() {
  const { state, dispatch, reducerActionTypes } = getContext();

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
          />
        </div>
      </div>
      <div className={styles.bottom}>
        {state.contacts.map((contact, index) => {
          return (
            <div
              className={styles.contact}
              key={index}
              onClick={() =>
                dispatch({
                  type: reducerActionTypes.SELECTEDCONTACT,
                  payload: { number: contact.number },
                })
              }
            >
              <div>
                <div className={styles.contact_profile}>
                  <Image
                    fill
                    alt=""
                    className="rounded-full"
                    src={`${profileUrl}/${contact.profile}`}
                  />
                </div>
              </div>
              <div className={styles.contact_info}>
                <div className={styles.contact_info_top}>
                  <div>
                    <span>{contact.name}</span>
                  </div>
                  <div>
                    <span className={styles.contact_message_date}>
                      {faker.datatype.number({ min: 5, max: 10 })}pm
                    </span>
                  </div>
                </div>
                <div className={styles.contact_info_bottom}>
                  <div>
                    <span className={styles.contact_last_message}>
                      {faker.lorem.paragraph()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Contacts;
