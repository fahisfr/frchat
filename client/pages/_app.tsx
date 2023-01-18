import "../styles/globals.css";
import type { AppProps } from "next/app";
import Context from "../helper/context";
import SidePopUPMessage from "../components/sidePopUpMessage.js/SidePopUPMessage";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Context>
      <SidePopUPMessage />
      <Component {...pageProps} />
    </Context>
  );
}
