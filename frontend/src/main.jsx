import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

import "./App.css";

function Root() {
  const [path, setPath] = React.useState(
    window.location.pathname
  );

  const [loggedIn, setLoggedIn] =
    React.useState(
      localStorage.getItem(
        "adminLoggedIn"
      ) === "true"
    );

  const handleLogin = () => {
    setLoggedIn(true);
    setPath("/admins");
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "adminLoggedIn"
    );

    setLoggedIn(false);
    setPath("/admins");
  };

  if (path === "/admins") {

    if (!loggedIn) {
      return (
        <AdminLogin
          onLogin={handleLogin}
        />
      );
    }

    return (
      <Admin
        onLogout={handleLogout}
      />
    );
  }

  return <App />;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Root />
);