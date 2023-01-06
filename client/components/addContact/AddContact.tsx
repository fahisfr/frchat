import axios from "../../helper/axios";
import React, { FormEvent, useState } from "react";
import styles from "./styles.module.scss";
import { getContext } from "../../helper/context";

type AddContactProps = {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddContact({ setTrigger }: AddContactProps) {
  const { triggerSidePopUpMessage } = getContext();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await axios("POST", "/contact/add-contact", {
      name,
      number,
    });
    if (res) {
      triggerSidePopUpMessage({ error: false, message: res.message });
    } else {
      triggerSidePopUpMessage({ error: true, message: res.error });
    }
  };

  return (
    <div className={styles.add_contact}>
      <div className={styles.ac_close} onClick={() => setTrigger(false)}></div>
      <div className={styles.ac_body}>
        <form onSubmit={onSubmit} className={styles.ac_form}>
          <div className={styles.ac_group}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.ac_group}>
            <label htmlFor="number">Number</label>
            <input
              id="number"
              placeholder=""
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div className={styles.ac_bottom}>
            <button type="submit">
              <span>Add Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContact;
