import axios from "../../axios";
import React, { FormEvent, useState } from "react";
import styles from "./css.module.css";
import { useRouter } from "next/router";
function index() {
  const router = useRouter();

  const [number, setNumber] = useState("1234567890");
  const [counteryCode, setCounteryCode] = useState();
  const [otp, sentOtp] = useState(new Array(4).fill(""));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await axios.post("/auth/login", {
      number,
      counteryCode,
      otp,
    });
    if (data.status === "ok") {
      localStorage.setItem("auth_token", data.token);
      router.replace("/");
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
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              type="text"
              maxLength={10}
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
