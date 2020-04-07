import React, { Component } from "react";
import Navbar from "../components/navbar";
import ShowHomePictures from "../components/displayHomepage";
import "../App.css";

class HomePage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Navbar />
                <ShowHomePictures />
            </div>
        );
    }
}

export default HomePage;




/*
 * 
 * import React, { Component } from "react";
import Navbar from "../components/navbar";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";

import axios from "axios";

//const imageData = require('../../../server/models/uploadedImage-schema');

class HomePage extends Component {
  constructor(props) {
    // super props allows props to be available
    super(props); // inside the constructor
    this.State = {
      //name: '',
      //image: '',
      search: "",
      uploadedImages: [],
      img: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const upload = {
      token: sessionStorage.getItem("jwt"),
      imgUpload: this.state.img
    };

    axios
      .post("http://localhost:8000/api/uploadedImage/authenticated", upload, {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        if (res.status === 200) {
          //Re-render the uploadedImages list
          this.getUploadedPictures();
          //Display a success message, indicating to the user that the image was uploaded
          this.setState({
            uploadedImages: res.data.uploadedImage,
            showSuccess: true,
            showFailure: false
          });
        } else {
          this.setState({ showSuccess: false, showFailure: true });
        }
      })
      .catch(error => {
        this.setState({ showSuccess: false, showFailure: true });
        console.log(error);
      });
    this.setState({
      upload: ""
    });
  }

  // state = {
  //   title: '',
  //   body: '',
  //   posts: []
  // };

  // onSubmit(e) {
  //   e.preventDefault();
  //   const search = {
  //     token: sessionStorage.getItem("jwt"),
  //     username: this.state.search
  //   };

  // userState = {
  //   username: '',
  //   userPosts: []
  // }

  // componentDidMount = () => {
  //   this.getBlogPost();
  //   this.getUserInformation();
  // };

  // getBlogPost = () => {
  //   axios.get('http://localhost:8000/api')
  //   .then((response) => {
  //     const data = response.data;
  //     this.setState ({ posts: data });
  //     console.log('Data has been received!');
  //   })
  //   .catch(() => {
  //     alert('Error retrieving data')
  //   })
  // }

  // getUserInformation = () => {
  //   axios.get('http://localhost:8000/api/users')
  //   .then((response) => {
  //     const user = response.user;
  //     this.setState ({ userPosts: user });
  //     console.log('Data has been received!');
  //   })
  //   .catch(() => {
  //     alert('Error retrieving user data');
  //   })
  // }

  // displayUserData = (userPosts) => {
  // if (userPosts.length == 0) {
  //   return null;
  // }

  //   return userPosts.map((post, index) => (
  //     <div key = {index}>
  //       <h3>
  //       {post.username}
  //       </h3>
  //       <p>
  //         {post.body}
  //       </p>
  //     </div>
  //   ))
  // };

  displayUploadedImages = uploadedImages => {
    if (uploadedImages.length === 0) {
      return null;
    }
    return uploadedImages.map((uploadedImage, index) => (
      <div key={index}>
        <h3>{uploadedImage.uploadedImage}</h3>
      </div>
    ));
  };

  // displayPicture() {
  //   imageData.exec(function(err,data) {
  //     if(err) throw  err;
  //     res.render()
  //   })
  // }

  arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  async componentDidMount() {
    // fetch('http://localhost:8000/uploads/2020-03-19T16:09:09.461ZSelection_022.png')
    //     .then((res) => res.json())
    //     .then((data) => {
    //         var base64Flag = 'data:image/jpeg;base64,';
    //         var imageStr = this.arrayBufferToBase64(data.img.data.data);
    //         this.setState({img: base64Flag + imageStr});
    //     });
    this.getUploadedPictures();
  }

  // displayBlogPost = (posts) => {
  //   if (posts.length == 0) {
  //     return null;
  //   }

  //   return posts.map((post, index) => (
  //     <div key = {index}>
  //       <h3>
  //       {post.title}
  //       </h3>
  //       <p>
  //         {post.body}
  //       </p>
  //     </div>
  //   ))
  // };

  // <Container fluid>
  //       <Row>
  //         <Col>
  //         Home Page Test
  //         {/* {this.state.uploadedImages.map(uploadedImage => (
  //         <li key={uploadedImage.id} style={{ position: 'relative' }}>
  //           <img src={uploadedImage.src}
  //             className="overlay"
  //             style={{
  //               position: 'absolute',
  //               width: '100%',
  //               height: '100%',
  //             }}
  //           />
  //         </li>
  //       ))} *///}
  //         </Col>
  //       </Row>
  //     </Container>
/*
  async getUploadedPictures() {
    // const res = await Axios
    // .get('http://localhost:8000/api/uploadedImage/authenticated', {
    //   headers: { token: sessionStorage.getItem("jwt") }
    // })
    // .then((response) => {
    //   const uploadedImage = res.uploadedImage
    //   this.setState({uploadedImages: uploadedImage})
    //   console.log('Image has been received!');
    // })
    // .catch(() => {
    //   alert('Error retrieving image data');
    // })
    // axios
    //   .get("http://localhost:8000/api/uploadedImage/", {
    //     //headers: { token: sessionStorage.getItem("jwt") }
    //   })
    //   .then(res => {
    //     if (res.status === 200) {
    //       console.log("Success");
    //       this.setState({
    //         uploadedImage: res.data.uploadedImage
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // <img src="../../../server/uploads/function toISOString() { [native code] }Selection_020" alt=""/>
  }
  // render() {
  //   if (!auth.isAuthenticated()) {
  //     return <Redirect to="/loginsignup" />;
  //   }
  //   const{img} = this.State;

  //   return (
  //     <div>
  //       <Navbar />
  //       <h2>Welcome to Home Page</h2>
  //       <img
  //               src={img}
  //               alt='Image'/>
  //     </div>
  //   )
  // };

  render() {
    if (!auth.isAuthenticated()) {
      return <Redirect to="/loginsignup" />;
    }

    return (
      <div>
        <Navbar />
        <h2>Welcome to Home Page</h2>
      </div>
    );
  }
}

export default HomePage;
*/