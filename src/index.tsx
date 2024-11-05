import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <FluentProvider theme={teamsLightTheme}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </FluentProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
