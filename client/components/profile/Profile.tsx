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
  const { state, triggerSidePopUpMessage } = getContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newAbout, setAbout] = useState<string>(state.about);
  const [profielPhoto, setProfilePhoto] = useState<ProfilePhoto>({
    file: null,
    preview: "",
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (newAbout) {
      formData.append("about", newAbout);
    }

    if (profielPhoto.file) {
      formData.append("profilePhoto", profielPhoto.file);
    }

    const { data } = await axios.put(
      "/user/edit-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.status === "ok") {
      triggerSidePopUpMessage({ error: false, message: data.message });
    } else if (data.status === "error") {
      triggerSidePopUpMessage({ error: true, message: data.error });
    }
  };

  const handleInputRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfilePhoto({ file, preview: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
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
          <div
            className={styles.pf_profile}
            onClick={() => inputRef?.current?.click()}
          >
            <Image
              fill
              alt=""
              className="rounded-full"
              src={
                profielPhoto.preview
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
              accept="image/*"
            />
          </div>
          <div className={styles.pf_number}>
            <span>{state.number}</span>
          </div>
        </div>
      </div>
      <form className={styles.pf_form} onSubmit={save}>
        <div className={styles.pf_form_group}>
          <label htmlFor="about" className={styles.pf_label}>
            About
          </label>
          <textarea
            rows={4}
            value={newAbout}
            onChange={(e) => setAbout(e.target.value)}
            id={styles.pf_about}
            className={styles.pf_input}
            placeholder=""
            maxLength={125}
          ></textarea>
        </div>
        <div className={styles.pf_form_bottom}>
          <button
            type="submit"
            disabled={newAbout === state.about && !profielPhoto.file}
            className={`${styles.pf_button} btn`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
