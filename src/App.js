import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";

//<Route exact path="/" component={token ? HomePage : LoginPage} />

const App = () => {
  const token = localStorage.getItem("idToken");

  return (
    <BrowserRouter>
      <Switch>
      <Route exact path="/" component={token ? HomePage : LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route
          path="/logout"
          component={() => {
            localStorage.removeItem("idToken");
            localStorage.removeItem("accessToken");
            window.location.href = "/";
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
