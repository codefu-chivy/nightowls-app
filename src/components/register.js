import React from "react";
import {DocumentTitle} from "react-document-title";
import {Router, browserHistory} from "react-router";


export default class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        email: "",
        password: "",
        notValidPass: false,
        notValidEmail: false,
        notValidUser: false,
        emailExists: false,
        button: "disabled"
      }
    }
    componentDidMount = () => {
      let registerButton = document.getElementById("register-button");
      registerButton.disabled = "true";
    }
    shouldEnableButton = () => {
      let button = document.getElementById("register-button");
      if (this.state.username && this.state.email && this.state.password) {
        if (!this.state.notValidPass) {
          button.removeAttribute("disabled");
          this.setState({
            button: "enabled"
          });
        }
        else {
          button.setAttribute("disabled", "true");
          this.setState({
            button: "disabled"
          });
        }
      }
      else {
        if (!button.hasAttribute("disabled")) {
          button.setAttribute("disabled", "true");
          this.setState({
            button: "disabled"
          });
        }
      }
      console.log(button)
    }

    validatePass = () => {
      let pass = document.getElementById("password")
      let passVal = pass.value;
      this.setState({
        password: passVal
      }, () => {
        if (this.state.password.length < 6) {
          if (pass.classList.contains("green")) {
            pass.classList.remove("green");
          }
          pass.classList.add("red"); 
          this.setState({
            notValidPass: true
          }, () => {
            this.shouldEnableButton();
          });
        }
        else {
          if (pass.classList.contains("red")) {
            pass.classList.remove("red");
          }
          pass.classList.add("green");
          this.setState({
            notValidPass: false
          }, () => {
            this.shouldEnableButton();
          });
        }
        console.log(pass.classList)
      });
    }

    checkEmail = () => {
      let emailEl = document.getElementById("email-ad");
      let value = emailEl.value;
      this.setState({
        email: value
      }, () => {
        this.shouldEnableButton();
      });
    }

    validateEmail = (callback) => {
      let email = document.getElementById("email-ad");
      let emailVal = email.value;
      let data = {
        email: emailVal
      }
      let emailValidate;
      this.setState({
        email: emailVal,
        alreadyExists: false
      });
      fetch("/validate-email", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => {
        return res.json();
      }).then((json) => {
        if (json.success === true) {
          if (json.alreadyExists) {
            this.setState({
              alreadyExists: true
            });
            return;
          }
          if (email.classList.contains("red")) {
            email.classList.remove("red");
          }
          email.classList.add("green")
          this.setState({
            notValidEmail: false
          });
        }
        else {
          if (email.classList.contains("green")) {
            email.classList.remove("green");
          }
          email.classList.add("red");
          this.setState({
            notValidEmail: true,
            alreadyExists: false
          });
        }
        console.log(email.classList)
        callback(json.success);
      });
    }

    validateUser = () => {
      let user = document.getElementById("username");
      let userVal = user.value;
      let userData;
      if (!userVal) {
        if (user.classList.contains("green")) {
          user.classList.remove("green");
        }
        return;
      }
      this.setState({
        username: userVal
      }, () => {
        userData = {
          username: this.state.username
        };
        fetch("/validate-user", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }).then((res) => {
          return res.json();
        }).then((json) => {
          if (json.valid) {
            this.setState({
              notValidUser: false
            }, () => {
              this.shouldEnableButton();
              if (user.classList.contains("red")) {
                user.classList.remove("red");
              }
              else if (user.classList.contains("green")) {
                return;
              }
              user.classList.add("green");
            });
          }
          else {
            this.setState({
              notValidUser: true
            }, () => {
              this.shouldEnableButton();
              if (user.classList.contains("green")) {
                user.classList.remove("green");
              }
              else if (user.classList.contains("red")) {
                return;
              }
              user.classList.add("red");
            });
          }
        })
      });
    }

    sendForm = () => {
      let registerData;
      this.validateEmail((isValid) => {
        if (isValid) {
          registerData = {
            password: this.state.password,
            email: this.state.email,
            username: this.state.username
          }
          fetch("/register", {
            method: "post", 
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
          }).then((res) => {
            return res.json();
          }).then((json) => {
            if (json.success) {
              browserHistory.push("/login");
            }
          });      
        }
      });
    }
    transition = (e) => {
      if (e.target.getAttribute("type") === "username") {
        if (document.getElementsByClassName("pass-label")[0].classList.contains("move")) {
          if (!document.getElementById("password").value) {
            document.getElementsByClassName("pass-label")[0].classList.remove("move");
          }
        }
        if (document.getElementsByClassName("mail-label")[0].classList.contains("move")) {
          if (!document.getElementById("email-ad").value) {
            document.getElementsByClassName("mail-label")[0].classList.remove("move");
          }
        }  
        document.getElementsByClassName("user-label")[0].classList.add("move");
      }
      else if (e.target.getAttribute("type") === "password") {
        if (document.getElementsByClassName("user-label")[0].classList.contains("move")) {
          if (!document.getElementById("username").value) {
            document.getElementsByClassName("user-label")[0].classList.remove("move");
          }
        }
        if (document.getElementsByClassName("mail-label")[0].classList.contains("move")) {
          if (!document.getElementById("email-ad").value) {
            document.getElementsByClassName("mail-label")[0].classList.remove("move");
          }
        }
        document.getElementsByClassName("pass-label")[0].classList.add("move");
      }
      else {
        if (document.getElementsByClassName("user-label")[0].classList.contains("move")) {
          if (!document.getElementById("username").value) {
            document.getElementsByClassName("user-label")[0].classList.remove("move");
          }
        }
        if (document.getElementsByClassName("pass-label")[0].classList.contains("move")) {
          if (!document.getElementById("password").value) {
            document.getElementsByClassName("pass-label")[0].classList.remove("move");
          }
        }
        document.getElementsByClassName("mail-label")[0].classList.add("move");
      }
        
    }
    render() {
        let invalidUser = this.state.notValidUser ? (<p id="user-exists">Username already exists</p>) : null;
        let emailExists = this.state.alreadyExists ? (<p id="email-exists">Email already exists! Try logging in</p>) : null;
        return (
            <div id="register">
              <div>
                <label className="user-label" htmlFor="username">Username</label>
                <input onFocus={this.transition} type="username" onKeyUp={this.validateUser} id="username" name="user"/>
                {invalidUser}
                <label className="pass-label" htmlFor="password">Password</label>
                <input onFocus={this.transition} type="password" onKeyUp={this.validatePass} id="password" name="pass"/>
                <label className="mail-label" htmlFor="email-ad">Email</label>
                <input onFocus={this.transition} type="email" onKeyUp={this.checkEmail} id="email-ad" name="email"/>
                {emailExists}
                <button onClick={this.sendForm} id="register-button">REGISTER</button>
              </div>
            </div>  
        )
    }
}