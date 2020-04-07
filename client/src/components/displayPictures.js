import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  FormFile,
  Form,
  Modal
} from "react-bootstrap";
import "../App.css"

class RenderPictures extends Component {
  constructor(props) {
    super(props);
    this.onDeleteButton = this.onDeleteButton.bind(this);

    this.state = {
      img: [],
      show: false
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8000/files/", {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        //Fill an array with the files sent back from the server. Each array element will use the filename and description
        //of the current element.
        var arr = [];
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            image: res.data[i].filename,
            description: res.data[i].description,
            photoid: res.data[i]._id
          });
        }
        //Fill this.state.img with the array from the for loop.
        this.setState({
          img: arr
        });
      });
  }

  onDeleteButton(photoid, index) {

    this.setState({...this.state.img[index], description: ''}); //resetting the description of the image at this index

    axios
      .delete("http://localhost:8000/files/" + photoid, {
        headers: {token: sessionStorage.getItem("jwt")}
      })
      .then(res => {
      })
      .catch(error => {
        console.log(error);
      });     
      setTimeout(()=>{alert("Image Deleted"); window.location.reload(true);}, 2000);
      //window.location.reload(true);

    }
  

  render() {
    return (
      <Container>
        <Row>
          {this.state.img.map((item, index) => {
            return (
              <Col>
                <Card
                  key={item}
                  style={{ width: "18rem" }}
                  bg="light"
                  border="dark"
                >
                  <Card.Img
                    variant="top"
                    src={"http://localhost:8000/image/" + item.image}
                    alt="Image could not be loaded"
                  />
                  <Card.Body>
                    <Card.Title>{item.description}</Card.Title>
                    <br></br>
                    <Card.Text>This will be the comment section</Card.Text>
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Prepend></InputGroup.Prepend>
                      <FormControl
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Leave a comment"
                      />
                    </InputGroup>
                    <Button variant="primary float-left">Post comment</Button>
                    <Form>
                      <Button onClick = {() => {this.onDeleteButton(item.photoid, index)}} className = "btn btn-danger btn-sm float-right">Delete</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
}

export default RenderPictures;
