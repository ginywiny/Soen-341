import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import AuthenticationForm from "./pages/loginsignup";
//import LoginForm from "./components/login";

//ReactDOM.render(<LoginForm />, document.getElementById("root"));
ReactDOM.render(<AuthenticationForm />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
