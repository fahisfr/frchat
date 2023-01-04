import React, { useRef, useState } from "react";
import styles from "./css.module.scss";
import { FiArrowLeft } from "react-icons/fi";
import { AiFillCamera } from "react-icons/ai";

import Image from "next/image";
import { getContext } from "../../helper/context";
import axios, { getProfileUrl } from "../../helper/axios";
import { Trigger } from "../../helper/interfaces";

interface ProfilePhoto {
  file: File | null;
  preview: string;
}

function Profile({ trigger, setTrigger }: Trigger) {
  const { state } = getContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newAbout, setAbout] = useState<string>("");
  const [profielPhoto, setProfilePhoto] = useState<ProfilePhoto>({
    file: null,
    preview: "",
  });

 

  const changeProfiel = () => {
    if (inputRef.current != null) {
      inputRef.current.click();
    }
  };

  const handleInputRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfilePhoto({ file, preview: reader.result });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`${styles.profile} ${
        trigger ? "margin-left-0" : "margin-left-full"
      }`}
    >
      <div className={styles.pf_top}>
        <FiArrowLeft
          size={30}
          className={styles.pf_icon}
          onClick={() => setTrigger(!trigger)}
        />
        <div>
          <span className={styles.pf_title}>Profile</span>
        </div>
      </div>
      <div className={styles.pf_body}>
        <div className={styles.pf_info}>
          <div className={styles.pf_profile} onClick={changeProfiel}>
            <Image
              fill
              alt=""
              className="rounded-full"
              src={
                profielPhoto.preview === " "
                  ? profielPhoto.preview
                  : getProfileUrl(state.profile)
              }
            />
            <AiFillCamera className={styles.camera_icon} />
            <input
              type="file"
              onChange={handleInputRefChange}
              style={{ display: "none" }}
              ref={inputRef}
            />
          </div>
          <div className={styles.pf_number}>
            <span>{state.number}</span>
          </div>
        </div>
      </div>
      <form className={styles.pf_form}>
        <div className={styles.pf_form_group}>
          <label htmlFor="about" className={styles.pf_label}>
            About
          </label>
          <textarea
            rows={4}
            value={newAbout ? newAbout : state.about}
            onChange={(e) => setAbout(e.target.value)}
            id={styles.pf_about}
            className={styles.pf_input}
            placeholder=""
          ></textarea>
        </div>
        <div className={styles.pf_form_bottom}>
          <button
            disabled={!newAbout}
            className={`${styles.pf_form_button} theme-bg-text`}
          >
            Save Edite
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
