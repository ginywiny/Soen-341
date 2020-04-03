import React, { Component } from "react";
import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal
} from "react-bootstrap";
import axios from "axios";

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      following: "",
      followers: "",
      bio: ""
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleShow(e) {
    this.setState({
      show: true
    });
  }
  handleClose(e) {
    this.setState({
      show: false
    });
  }

  //Once the component is mounted, a call is immediately made to fetch a user's details.
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/currentuser", {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        console.log(res);
        this.setState({
          username: res.data.username,
          email: res.data.email,
          following: res.data.following.length,
          followers: res.data.followers.length,
          bio: res.data.bio
        });
      });
  }
  onFormSubmit(e) {
    e.preventDefault();
    const newbio = { bio: this.state.bio };
    axios
      .post("http://localhost:8000/api/updatebio", newbio, {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            bio: res.data.bio
          });
          this.handleClose();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  onChangeBio(e) {
    this.setState({ bio: e.target.value });
  }

  render() {
    return (
      <Jumbotron fluid>
        <Container>
          <h2>{this.state.username}</h2>
          <Row>
            <Col>
              <h4>Biography</h4>
              {this.state.bio}
            </Col>
            <Col>
              <h4>Dankness Rating</h4>
            </Col>
            <Col>
              <h4>Following</h4>
              {this.state.following}
            </Col>
            <Col>
              <h4>Followers</h4>
              {this.state.followers}
            </Col>
            <Col>
              <Button variant="link" onClick={this.handleShow}>
                Update your profile
              </Button>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update user biography</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.onFormSubmit}>
              <Form.Group controlId="bio">
                <Form.Label>Biography</Form.Label>
                <Form.Control
                  type="bio"
                  placeholder="Enter bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChangeBio}
                />
              </Form.Group>
              <Button variant="dark" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Jumbotron>
    );
  }
}

export default AccountDetails;
