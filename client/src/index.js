import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "./Features/User";
import { fetchUser } from "./Features/User";

const store = configureStore({
  reducer: {
    user,
  },
  devTools: process.env.NODE_ENV !== "production",
});

localStorage.getItem("auth_token") && store.dispatch(fetchUser());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <Provider store={store}>
    <App />
  </Provider>

);

reportWebVitals();