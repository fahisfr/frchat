import axios from "../../helper/axios";
import React, { FormEvent, useState } from "react";
import styles from "./styles.module.scss";
import { getContext } from "../../helper/context";

type AddContactProps = {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddContact({ setTrigger }: AddContactProps) {
  const { dispatch, reducerActionTypes, triggerSidePopUpMessage } =
    getContext();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    const { data } = await axios.post("/contact/add-contact", {
      name,
      number,
    });
    setBtnLoading(false);
    if (data.status === "ok") {
      dispatch({
        type: reducerActionTypes.ADD_CONTACT,
        payload: {
          contact: data.contact,
        },
      });
      setTrigger(false);
    } else if (data.status === "error") {
      triggerSidePopUpMessage({ error: true, message: data.error });
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
              required
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
              required
            />
          </div>
          <div
            className={`${styles.ac_bottom}  ${btnLoading && "btn_loading"}`}
          >
            <button className={`${styles.ac_btn} btn`} type="submit">
              <span className="btn_text">Add Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContact;
