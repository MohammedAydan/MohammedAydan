import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext/UserContext.jsx";
import { ReposProvider } from "./contexts/ReposContext/ReposContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ReposProvider>
        <App />
      </ReposProvider>
    </UserProvider>
  </React.StrictMode>
);
