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
  const [newName, setNewName] = useState<string>(contact.name);
  const { state, dispatch, reducerActionTypes, triggerSidePopUpMessage } =
    getContext();
  const removeContact = async () => {
    const res = await axios("PUT", "contact/remove", {
      number: contact.number,
    });
  };

  const changeName = async () => {
    const response = await axios("PUT", "contact/change-name", {
      number: contact.number,
      name: newName,
    });

    if (response) {
      dispatch({
        type: reducerActionTypes.CHANGE_CONTACT_NAME,
        payload: { name: newName, number: contact.number },
      });
      triggerSidePopUpMessage({ error: false, message: response.message });
    } else {
      triggerSidePopUpMessage({ error: true, message: response.error });
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
              className="rounded-full"
              src={getProfileUrl(contact.profile)}
            />
          </div>
          <div className={styles.pf_number}>
            <span>{contact.number}</span>
          </div>
          <div>
            <div>
              <span>{contact.about}</span>
            </div>
          </div>
        </div>
        <div className={styles.pf_contact_options}>
          <div>
            <label>Saved Name</label>
            <input
              className={styles.pf_input}
              id={styles.pf_name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button
            disabled={newName === contact.name}
            onClick={changeName}
            className={`${styles.pf_button} theme-bg-text`}
          >
            Save
          </button>
          <button className={`${styles.pf_button} ${styles.remove_contact}`}>
            Remove Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactProfile;
