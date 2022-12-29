import axios from "../../helper/axios";
import React, { FormEvent, useState } from "react";
import styles from "./styles.module.scss";

type AddContactProps = {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddContact({ setTrigger }: AddContactProps) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const { data } = await axios.post("/contact/add-contact", { name, number });
    if (data.status === "ok") {
      return;
    }
    setError(data.error);
  };

  return (
    <div className={styles.add_contact}>
      <div className={styles.ac_close} onClick={() => setTrigger(false)}></div>
      <div className={styles.ac_body}>
        {error && (
          <div className={styles.ac_error}>
            <span>{error}</span>
          </div>
        )}
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
