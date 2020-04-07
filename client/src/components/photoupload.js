import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import { Button, Modal, Form } from "react-bootstrap";


class RenderProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      description: null,
      show: false
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
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

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append("myImage", this.state.file);
    formData.append("myDescription", this.state.description);

    axios
      .post("http://localhost:8000/uploads", formData, {
        headers: {
          "content-type": "multipart/form-data",
          token: sessionStorage.getItem("jwt")
        }
      })
      .then(res => {
        alert("The file was successfully uploaded");
        console.log("wait");
        window.location.reload(true);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  onChangeDescription(e) {
    this.setState({ description: e.target.value });
  }

  render() {
    return (
      <div>
        <div className="App">
          <Button variant="primary" onClick={this.handleShow}>
            Post a new meme
          </Button>
          <br></br>
          <br></br>

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Post a new meme</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.onFormSubmit}>
                <Form.Group controlId="photo">
                  <Form.Control
                    accept="image/png, image/jpeg"
                    type="file"
                    name="myImage"
                    onChange={this.onChange}
                  ></Form.Control>
                </Form.Group>

                <br></br>
                <Form.Group controlId="description">
                  <Form.Control
                    type="description"
                    placeholder="Enter description (Optional)"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                  />
                </Form.Group>
                <Button variant="dark" type="submit">
                  Post
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

export default RenderProfilePage;
