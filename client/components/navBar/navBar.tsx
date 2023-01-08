import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./css.module.css";

import { AiOutlineHome, AiOutlineUserAdd } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import AddContact from "../addContact/AddContact";
import { profileUrl } from "../../helper/axios";
import { getContext } from "../../helper/context";
import { BsSunFill, BsFillMoonFill } from "react-icons/bs";

interface navBarProps {
  setProfileTrigger: Dispatch<SetStateAction<boolean>>;
}

function NavBar({ setProfileTrigger }: navBarProps) {
  const { state, reducerActionTypes, dispatch } = getContext();
  const [addContact, setAddContact] = useState(false);

  return (
    <div className={styles.navbar_container}>
      {addContact && <AddContact setTrigger={setAddContact} />}
      <div className={styles.wb_logo}>
        <Image fill alt="" className="rounded-full" src="/frlogo.png" />
      </div>
      <div className={styles.options}>
        {/* <div className={styles.group}>
          <AiOutlineHome className={styles.icons} />
        </div> */}
        <div
          className={styles.group}
          onClick={() => setProfileTrigger((state) => !state)}
        >
          <CgProfile className={styles.icons} />
        </div>
        <div className={styles.group}>
          <AiOutlineUserAdd
            onClick={(e) => setAddContact(!addContact)}
            className={styles.icons}
          />
        </div>
        <div
          onClick={() =>
            dispatch({
              type: reducerActionTypes.CHANGE_THEME,
            })
          }
        >
          {state.darkTheme ? (
            <BsSunFill className={styles.theme_icon} />
          ) : (
            <BsFillMoonFill className={styles.theme_icon} />
          )}
        </div>
      </div>

      <div className={styles.profile}>
        <Image
          fill
          alt=""
          className="rounded-full"
          src={`${profileUrl}/${state.profile}`}
        />
      </div>
    </div>
  );
}

export default NavBar;
