import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "../App.css";

class RenderLoginForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //By default the state contains an empty username and empty password.
    this.state = {
      email: "",
      password: ""
    };
  }
  //When this function is called, change the username to the new value.
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  //When this function is called, change the username to the new value.
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post("http://localhost:8000/api/login", user)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ email: "", password: "" });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Log in</h1>
          <br />
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={this.state.email}
                onChange={this.onChangeEmail}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </header>
      </div>
    );
  }
}

export default RenderLoginForm;
