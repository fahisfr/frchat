import axios from "../../helper/axios";
import React, { FormEvent, useState, useRef, useEffect } from "react";
import styles from "./css.module.css";
import { useRouter } from "next/router";
import { getContext } from "../../helper/context";
import Head from "next/head";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import SidePopUPMessage from "../../components/sidePopUpMessage.js/SidePopUPMessage";
import Image from "next/image";
let currentOtpIndex: number = 0;

function Index() {
  const router = useRouter();

  const { dispatch, reducerActionTypes } = getContext();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("91");
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);

  const [verifyOtp, setVerifyOpt] = useState<boolean>(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    otpInputRef.current?.focus();
  }, [activeOtpIndex]);

  const otpOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newArray = [...otp];
    newArray[currentOtpIndex] = value.substring(value.length - 1);
    if (value) setActiveOtpIndex(currentOtpIndex + 1);
    else setActiveOtpIndex(currentOtpIndex - 1);

    setOtp(newArray);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verifyOtp) {
      verifyOtpNow();
    } else {
      login();
    }
  };

  const verifyOtpNow = async () => {
    setBtnLoading(true);
    const { data } = await axios.post("/user/verify-otp", {
      otp: otp.join(""),
      number,
    });
    if (data.status === "ok") {
      localStorage.setItem("access_token", data.token);
      router.replace("/");
    } else if (data.status === "error") {
      triggerPopUpMessage({ error: true, message: data.message });
    }
    setBtnLoading(false);
  };

  const login = async () => {
    setBtnLoading(true);
    const { data } = await axios.post("/user/login", {
      number,
    });

    if (data.status === "ok") {
      setVerifyOpt(true);
    } else if (data.status === "error") {
      triggerPopUpMessage({ error: true, message: data.message });
    }
    setBtnLoading(false);
  };

  const triggerPopUpMessage = (arg: { error: boolean; message: string }) => {
    dispatch({
      type: reducerActionTypes.TRIGGER_SIDE_POPUP_MESSAGE,
      payload: arg,
    });
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOtpIndex = index;
    if (e.key === "Backspace") setActiveOtpIndex(currentOtpIndex - 1);
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
        <Image fill src="/lgbg.webp" alt="" />
        <SidePopUPMessage />
        <div className={styles.lg_body}>
          <div className={styles.lg_title}>
            <h1 className={styles.lg_title_text}>
              {verifyOtp
                ? `Please enter the OTP sent to +${number}`
                : "Enter Your Phone Number"}
            </h1>
          </div>
          <form onSubmit={onSubmit}>
            {verifyOtp ? (
              <div className={styles.otp_inputs_wrapper}>
                {otp.map((otp, index) => {
                  return (
                    <input
                      ref={index === activeOtpIndex ? otpInputRef : null}
                      key={index}
                      value={otp}
                      type="number"
                      placeholder="0"
                      onChange={otpOnChange}
                      onKeyDown={(e) => handleOnKeyDown(e, index)}
                      className={styles.otp_input}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles.lg_number_wrapper}>
                <PhoneInput
                  placeholder="Enter phone number"
                  enableSearch={true}
                  value={number}
                  onChange={setNumber}
                  inputClass={styles.number_input}
                />
              </div>
            )}

            <div
              className={`${styles.lg_bottom}  ${btnLoading && "btn_loading"}`}
            >
              <button type="submit" className={`${styles.lg_next_btn} btn`}>
                <span className="btn_text">Next</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Index;
