import React, { useState } from "react";
import styles from "./css.module.css";
function index() {

  const [number, setNumber] = useState();
  const [counteryCode, setCounteryCode] = useState();
  const [otp, sentOtp] = useState(new Array(4).fill(""));

  return (
    <div className={styles.login_container}>
      <div className={styles.lg_body}>
        <div className={styles.lg_title}>
          <h1 className={styles.lg_title_text}>Enter Your Phone Number</h1>
        </div>
        <form>
          {/* <div className={styles.otp_inputs_wrapper}>
            {otp.map((otp) => {
              return <input maxLength="1" className={styles.otp_input} />;
            })}
          </div> */}
          {/* <div className={styles.lg_number_wrapper}>
            <select className={styles.country_code}>
              <option value="91">+91</option>
            </select>
            <input
              placeholder="00 00 00 00 00"
              className={styles.number_input}
              type="number"
              id="number"
              max="10"
            />
          </div> */}
        </form>
        <div className={styles.lg_bottom}>
          <button type="submit" className={styles.lg_next_btn}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default index;
