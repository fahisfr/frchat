import styles from "./css.module.scss";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { Trigger, Contact } from "../../helper/interfaces";
import { getProfileUrl } from "../../helper/axios";
import { useState } from "react";
import axios from "../../helper/axios";
import { getContext } from "../../helper/context";
interface ContactProfileProps extends Trigger {
  contact: Contact;
}

function ContactProfile({ trigger, setTrigger, contact }: ContactProfileProps) {
  const { dispatch, reducerActionTypes } = getContext();
  const [newName, setNewName] = useState<string>(contact.name);
  const number = contact?.number;
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);

  const removeContact = async () => {
    const { data } = await axios.put("contact/remove-contact", { number });

    if (data.status === "ok") {
      dispatch({
        type: reducerActionTypes.REMOVE_CONTACT,
        payload: {
          number,
          message: data.message,
        },
      });
    } else if (data.status === "error") {
      dispatch({
        type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
        payload: { error: true, message: data.message },
      });
    }
  };

  const changeName = async () => {
    setSaveBtnLoading(true);
    const { data } = await axios.put("contact/change-name", {
      number: number,
      name: newName,
    });
    setSaveBtnLoading(false);
    if (data.status) {
      dispatch({
        type: reducerActionTypes.CHANGE_CONTACT_NAME,
        payload: { name: newName, number, message: data.message },
      });
    } else {
      dispatch({
        type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
        payload: { error: true, message: data.message },
      });
    }
  };

  return (
    <div
      className={`${styles.contact_profile} ${
        trigger ? styles.con_open : styles.con_close
      } `}
    >
      <div className={styles.pf_top}>
        <FiArrowLeft size={30} onClick={() => setTrigger((state) => !state)} />
        <div>
          <span className={styles.pf_title}>Contact Profile</span>
        </div>
      </div>
      <div className={styles.pf_body}>
        <div className={styles.pf_info}>
          <div className={styles.pf_profile}>
            <Image
              fill
              alt=""
              objectFit="cover"
              className="rounded-full"
              src={getProfileUrl(contact.profile)}
            />
          </div>
          <div className={styles.pf_number}>
            <span>{number}</span>
          </div>
          <div className={styles.pf_about}>
            <span>{contact.about}</span>
          </div>
        </div>
        <div className={styles.pf_contact_options}>
          <div>
            <label>Name</label>
            <input
              className={styles.pf_input}
              id={styles.pf_name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className={`${saveBtnLoading && "btn_loading"}`}>
            <button
              disabled={newName === contact.name}
              onClick={changeName}
              className={`${styles.pf_button} btn`}
            >
              <span className="btn_text">Save</span>
            </button>
          </div>
          <div className={`${saveBtnLoading && "btn_loading"}`}>
            <button
              onClick={removeContact}
              className={`${styles.pf_button} ${styles.remove_contact}`}
            >
              Remove Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactProfile;
