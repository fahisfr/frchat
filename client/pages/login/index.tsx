import axios from "../../helper/axios";
import React, { FormEvent, useState } from "react";
import styles from "./css.module.css";
import { useRouter } from "next/router";
import { getContext } from "../../helper/context";
import Head from "next/head";
import { reducerActionTypes } from "../../helper/reducerActions";

function Index() {
  const router = useRouter();

  const { dispatch } = getContext();

  const [number, setNumber] = useState<number>(1234567890);
  const [counteryCode, setCounteryCode] = useState();
  const [otp, setOtp] = useState(new Array(4).fill(""));

  const [verifyOtp, setVerifyOpt] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (verifyOtp) {
      const { data } = await axios.post("/user/verify-otp", { otp, number });
      if (data.status === "ok") {
        localStorage.setItem("access_token", data.token);
        router.replace("/");
      } else if (data.status === "error") {
        dispatch({
          type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
          payload: { error: true, message: data.error },
        });
      }
    } else {
      const { data } = await axios.post("/user/login", {
        number,
        counteryCode,
        otp,
      });

      if (data.status === "ok") {
        setVerifyOpt(true);
      } else if (data.status === "error") {
        dispatch({
          type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
          payload: { error: true, message: data.error },
        });
      }
    }
  };

  const otpOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setOtp((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = e.target.value;
      return newArray;
    });
  };

  return (
    <>
      <Head>
        <title>FrChat-Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Login to start chatting now." />
        <meta name="keywords" content="chat, friends, family, login, FRChat" />
      </Head>
      <div className={styles.login_container}>
        <div className={styles.lg_body}>
          <div className={styles.lg_title}>
            <h1
              className={styles.lg_title_text}
              onClick={() => setVerifyOpt(!verifyOtp)}
            >
              Enter Your Phone Number
            </h1>
          </div>
          <form onSubmit={onSubmit}>
            {verifyOtp ? (
              <div className={styles.otp_inputs_wrapper}>
                {otp.map((otp, index) => {
                  return (
                    <input
                      key={index}
                      value={otp}
                      type="number"
                      placeholder="0"
                      onChange={(e) => otpOnChange(e, index)}
                      maxLength={1}
                      className={styles.otp_input}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles.lg_number_wrapper}>
                <select className={styles.country_code}>
                  <option value="91">+91</option>
                </select>
                <input
                  placeholder="00 00 00 00 00"
                  className={styles.number_input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNumber(parseInt(e.target.value));
                  }}
                  value={number}
                  type="number"
                  id="number"
                />
              </div>
            )}

            <div className={styles.lg_bottom}>
              <button type="submit" className={styles.lg_next_btn}>
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Index;
