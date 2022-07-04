import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OnboardContextProvider } from "../context/OnboardContext";
import "../styles/globals.scss";
import {SWRConfig} from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <OnboardContextProvider>
        <SWRConfig value={{
            refreshInterval: 3000
        }}>
          <Component {...pageProps} />
          <ToastContainer />
        </SWRConfig>
    </OnboardContextProvider>
  );
}

export default MyApp;
