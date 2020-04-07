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




//-------------------------------------------------------------------------------------------------------------------------
// import React, { Component } from "react";
// import axios from "axios";
// import {
//   Container,
//   Form,
//   Row,
//   Col,
//   Card,
//   Button,
//   InputGroup,
//   FormControl
// } from "react-bootstrap";
 
// class RenderProfilePictures extends Component {
//   constructor(props) {
//     super(props);
//     this.onChangeComment = this.onChangeComment.bind(this);
//     this.state = {
//       img: [],
//       comments: [],
//       photoId: [],
//       title: "",
//       comment: ""
//     };
//   }
 
//   onChangeComment(e) {
//     this.setState({ comment: e.target.value });
//   }
 
//   componentDidMount() {
//     //RETRIEVING ALL FILES FOR THE ACTIVE USER
//     axios
//       .get("http://localhost:8000/files", {
//         headers: { token: sessionStorage.getItem("jwt") }
//       })
//       .then(res => {
//         //Fill array with files returned from the server
//         var arr = [];
//         for (var i = 0; i < res.data.length; i++) {
//           arr.push({
//             image: res.data[i].filename,
//             description: res.data[i].description,
//             photoId: res.data[i]._id
//           });
//         }
 
//         //Define this.state.img with the an array of photo details
//         this.setState({
//           img: arr
//         });
//         //Pass the array to the next call.
//         return arr;
//       })
//       .then(result => {
//         //RETRIEVING ALL COMMENTS FOR THE PHOTOS
//         let commentarray = [];
//         for (var i = 0; i < result.length; i++) {
//           let photoId = {
//             photoId: result[i].photoId
//           };
//           //For each photoID, get all comments from the server.
//           axios
//             .post("http://localhost:8000/api/comments/find", photoId, {
//               headers: {
//                 token: sessionStorage.getItem("jwt")
//               }
//             })
//             .then(res => {
//               //For each photo, push comments as an element into commentarray.
//               if (res.data.length > 0) {
//                 commentarray.push(res.data.comments);
//               }
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         }
//         //THIS ARRAY CONTAINS ALL THE COMMENTS. EACH ELEMENT HAS A UNIQUE COMMENT ID, PHOTOID, AND AN ARRAY OF COMMENTS
//         console.log(commentarray);
//       });
//   }
 
//   onSubmit(photoId, e) {
//     e.preventDefault();
//     const comment = {
//       photoId: photoId,
//       comment: this.state.comment
//     };
//     axios
//       .post("http://localhost:8000/api/comments/photo", comment, {
//         headers: {
//           token: sessionStorage.getItem("jwt")
//         }
//       })
//       .then(res => {


//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }
 
//   render() {
//     return (
//       <Container>
//         <Row>
//           {this.state.img.map(item => {
//             return (
//               <Col>
//                 <Card
//                   key={item}
//                   style={{ width: "18rem" }}
//                   bg="light"
//                   border="dark"
//                   onSubmit={this.submitComment}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={"http://localhost:8000/image/" + item.image}
//                     alt="Image could not be loaded"
//                   />
//                   <Card.Body>
//                     <Card.Title>{item.description}</Card.Title>
 
//                     <Card.Text>This will be the comment section</Card.Text>
 
//                     <Form onSubmit={e => this.onSubmit(item.photoId, e)}>
//                       <InputGroup size="sm" className="mb-3">
//                         <InputGroup.Prepend></InputGroup.Prepend>
//                         <FormControl
//                           aria-label="Small"
//                           aria-describedby="inputGroup-sizing-sm"
//                           placeholder="Leave a comment"
//                           name="userComment"
//                           value={this.state.comment}
//                           onChange={this.onChangeComment}
//                         />
//                       </InputGroup>
//                       <Button variant="primary" type="submit">
//                         Post comment
//                       </Button>
//                     </Form>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       </Container>
//     );
//   }
// }
 
// export default RenderProfilePictures;


















//---------------------------------------------------------------------------------------------------------------
// import React, { Component } from "react";
// import axios from "axios";

// import {
//   Container,
//   Form,
//   Row,
//   Col,
//   Card,
//   Button,
//   InputGroup,
//   FormControl
// } from "react-bootstrap";

// class RenderProfilePictures extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       img: [],
//       comments: [],
//       photoId: [],
//       title:'',
//       body:''
//     };
//   }


//   onChangeComment(e) {
//     this.setState({ body: e.target.value });
//   }

//   componentDidMount() {
//     axios
//       .get("http://localhost:8000/files", {
//         headers: { token: sessionStorage.getItem("jwt")}
//       })
//       .then(res => {
//         //Fill an array with the files sent back from the server. Each array element will use the filename and description
//         //of the current element.
//         var arr = [];
//         for (var i = 0; i < res.data.length; i++) {
//           arr.push({
//             image: res.data[i].filename,
//             description: res.data[i].description,
//             photoId: res.data[i]._id  //Get photoId to post to schema to add for user comments
//           });
//           this.addPhotoId(arr[i].photoId);
//         }
//         this.setState({
//           img: arr
//         });
//       });
      
//       this.renderComments();
//   }

//   renderComments() {
//     axios.
//       get("http://localhost:8000/api/comments/", {
//         headers: { token: sessionStorage.getItem("jwt") }
//       })
//       .then(res => {
//         if (res.status === 200) {
//           console.log("Comment found");
//           this.setState({
//             comments: res.data.comments
//           });
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       }); 
//   }

//   addPhotoId(photoId) {
//     //Get comments from server using this get request
//     axios
//       .post("http://localhost:8000/comments/", photoId, {
//         headers: {
//           token: sessionStorage.getItem("jwt")
//         }
//       })
//       .then(res => {
//         alert("Id posted");
//       })
//   }

// onCommentButton(photoId) {
//   axios.
//     patch("http://localhost:8000/api/comments/" + photoId, { 
//       headers: {token: sessionStorage.getItem("jwt")}
//     })
// }


// onSubmit(photoId, e) {
//   e.preventDefault();

//   const comment = {
//     photoId: this.state.photoId,
//     body: this.state.body
//   };
//   axios
//     .post("http://localhost:8000/api/comments/" + photoId, comment )
//     .then(res => {
//       if (res.status === 200) {
//         console.log("Comment added");
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }


//   render() {
//     return (
//       <Container>
//         <Row>
//           {this.state.img.map(item => {
//             return (
//               <Col>
//                 <Card
//                   key={item}
//                   style={{ width: "18rem" }}
//                   bg="light"
//                   border="dark"
//                   onSubmit={this.submitComment}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={"http://localhost:8000/image/" + item.image}
//                     alt="Image could not be loaded"
//                   />
//                   <Card.Body>
//                     <Card.Title>{item.description}</Card.Title>

//                     {this.state.comments.map(comment => {
//                       return (
//                       <Card.Subtitle
//                       type="text"
//                       name="title"
//                       value={comment}
//                       placeholder="Comment Section"
//                       >
//                       </Card.Subtitle>
//                       );
//                     })
//                   }

//                     <Card.Text>
//                       This will be the comment section
//                       </Card.Text>


//                       <Form onSubmit={e => this.onSubmit(item.photoId, e)}>
//                       <InputGroup size="sm" className="mb-3">
//                         <InputGroup.Prepend></InputGroup.Prepend>
//                         <FormControl
//                           aria-label="Small"
//                           aria-describedby="inputGroup-sizing-sm"
//                           placeholder="Leave a comment"
//                           type="body"
//                           name="body"
//                           value={this.state.body}
//                           onChange={this.onChangeComment}
//                         />
//                       </InputGroup>
//                     <Button 
//                     variant="primary" type="submit">
//                       Post comment
//                       </Button>
//                   </Form>



//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       </Container>
//     );
//   }
// }

// export default RenderProfilePictures;
