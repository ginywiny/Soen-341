import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "../App.css";
import LoginForm from "../components/login";
import SignUpForm from "../components/signup";

class AuthenticationForm extends Component {
  //Default state sets isLogin:true to have the login page displayed first.
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.state = {
      isLogin: true,
      isRegister: false
    };
  }
  //Login handler to set isLogin true and isRegister false.
  handleLoginClick() {
    this.setState({
      isLogin: true,
      isRegister: false
    });
  }
  //Register handler to set isRegister true and isLogin false.
  handleRegisterClick() {
    this.setState({
      isLogin: false,
      isRegister: true
    });
  }
  render() {
    //Declare two constants, isLogin and isRegister, to be used in our render function.
    const isLogin = this.state.isLogin;
    const isRegister = this.state.isRegister;
    let form;

    //If current state has isLogin set to true, render the login form.
    if (isLogin) {
      form = (
        <div className="Windows-background">
          <RegisterButton onClick={this.handleRegisterClick} />
          <LoginForm exact path="/login" />
        </div>
      );
    }
    //if current state has isRegister set to true, render the register form.
    if (isRegister) {
      form = (
        <div className="Windows-background">
          <LoginButton onClick={this.handleLoginClick} />
          <SignUpForm exact path="/signup" />
        </div>
      );
    }
    //Render the form
    return <div>{form}</div>;
  }
}

//LoginButton function that renders a login button. The onClick attribute
//is set to props.onClick by default and will be overridden by the handleRegisterClick
//function in the AuthenticationForm Class
function LoginButton(props) {
  return (
    <Button variant="secondary" size="lg" onClick={props.onClick} block>
      <Badge variant="success">
        Already have an account? Click here to Login
      </Badge>
    </Button>
  );
}

//RegisterButton function that renders a login button. The onClick attribute
//is set to props.onClick by default and will be overridden by the handleLoginClick
//function in the AuthenticationForm Class
function RegisterButton(props) {
  return (
    <Button variant="secondary" size="lg" onClick={props.onClick} block>
      <Badge variant="danger">
        Don't have an account? Click here to Sign up
      </Badge>
    </Button>
  );
}
export default AuthenticationForm;
