import axios from "../../helper/axios";
import React, { FormEvent, useState } from "react";
import styles from "./css.module.css";
import { useRouter } from "next/router";
import { getContext } from "../../helper/context";

function index() {
  const router = useRouter();

  const { triggerSidePopUpMessage } = getContext();

  const [number, setNumber] = useState<number>(123456790);
  const [counteryCode, setCounteryCode] = useState();
  const [otp, sentOtp] = useState(new Array(4).fill(""));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (number.toString.length === 10) {
      console.log(number.toString.length);

      return;
    }
    const response = await axios.post("/auth/login", {
      number,
      counteryCode,
      otp,
    });

    if (response) {
      localStorage.setItem("auth_token", response.token);
      router.replace("/");
    } else {
      triggerSidePopUpMessage({ error: true, message: response.error });
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.lg_body}>
        <div className={styles.lg_title}>
          <h1 className={styles.lg_title_text}>Enter Your Phone Number</h1>
        </div>
        <form onSubmit={onSubmit}>
          {/* <div className={styles.otp_inputs_wrapper}>
            {otp.map((otp) => {
              return <input maxLength="1" className={styles.otp_input} />;
            })}
          </div> */}
          <div className={styles.lg_number_wrapper}>
            <select className={styles.country_code}>
              <option value="91">+91</option>
            </select>
            <input
              placeholder="00 00 00 00 00"
              className={styles.number_input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNumber(e.target.value);
              }}
              value={number}
              type="number"
              id="number"
            />
          </div>{" "}
          <div className={styles.lg_bottom}>
            <button type="submit" className={styles.lg_next_btn}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default index;
