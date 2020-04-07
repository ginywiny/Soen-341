import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    InputGroup,
    FormControl
} from "react-bootstrap";

class RenderHomepagePictures extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: [],
            name: []
        };
    }

    loadImages() {
        //Get all users that current user is following.
        axios
            .get("http://localhost:8000/api/follow/", {
                headers: { token: sessionStorage.getItem("jwt") }
            })
            .then(res => {
                this.setState({
                    name: res.data.following
                });
                return res.data.following;
            })
            .then(result => {
                //Get the photo file for each user
                for (var i = 0; i < result.length; i++) {
                    //Define current user.
                    let user = {
                        username: result[i]
                    };
                    //Create a promise for the files request.
                    axios
                        .post("http://localhost:8000/searchuser/files", user, {
                            headers: { token: sessionStorage.getItem("jwt") }
                        })
                        .then(res => {
                            //Push new information to this.state.img
                            let currentarray = [...this.state.img];
                            currentarray.push({
                                image: res.data[res.data.length - 1].filename,
                                username: user.username,
                                description: res.data[res.data.length - 1].description
                            });
                            //Set the state to the new array
                            this.setState({
                                img: currentarray
                            });
                        });
                }
            });
    }

    componentDidMount() {
        this.loadImages();
    }

    render() {
        return (
            <Container>
                <Row>
                    {this.state.img.map(item => {
                        return (
                            <Col>
                                <Card
                                    key={item}
                                    style={{ width: "18rem" }}
                                    bg="light"
                                    border="dark"
                                >
                                    <Card.Header>{item.username}</Card.Header>
                                    <Card.Img
                                        variant="top"
                                        src={"http://localhost:8000/image/" + item.image}
                                        alt="Image could not be loaded"
                                    />
                                    <Card.Body>
                                        <Card.Title>{item.description}</Card.Title>
                                        <Card.Text>This will be the comment section</Card.Text>
                                        <InputGroup size="sm" className="mb-3">
                                            <InputGroup.Prepend></InputGroup.Prepend>
                                            <FormControl
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                placeholder="Leave a comment"
                                            />
                                        </InputGroup>
                                        <Button variant="primary">Post comment</Button>
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
export default RenderHomepagePictures;