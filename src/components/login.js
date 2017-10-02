import React from "react";
import {browserHistory} from "react-router";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            invalid: null
        }
    }
    setUser = () => {
        let user = document.getElementById("login-user");
        let userVal = user.value;
        this.setState({
            username: userVal
        });
    }
    setPass = () => {
        let pass = document.getElementById("login-pass");
        let passVal = pass.value;
        this.setState({
            password: passVal
        });
    }
    handleLogin = () => {
        let loginData = {
            username: this.state.username,
            password: this.state.password
        }
        this.setState({
            invalid: false
        });
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success) {
                sessionStorage.setItem("token", JSON.stringify(json.token))
                window.location = "/";
            }
            else {
                this.setState({
                    invalid: true
                });
            }
        })
    }
    transition = (e) => {
        if (e.target.getAttribute("type") === "username") {
            if (document.getElementsByClassName("pass-label")[0].classList.contains("move")) {
                if (!document.getElementById("login-pass").value) {
                    document.getElementsByClassName("pass-label")[0].classList.remove("move");
                }
            }
            document.getElementsByClassName("user-label")[0].classList.add("move");
        }
        else if (e.target.getAttribute("type") === "password") {
            if (document.getElementsByClassName("user-label")[0].classList.contains("move")) {
                if (!document.getElementById("login-user").value) {
                    document.getElementsByClassName("user-label")[0].classList.remove("move");
                }
            }
            document.getElementsByClassName("pass-label")[0].classList.add("move");
        }
    }
    render() {
        let incorrect = this.state.invalid ? (<p id="invalid-pass">Invalid username and password combination.</p>) : null;
        setTimeout(() => {
            this.setState({
                invalid: false
            });
        }, 5000);
        return (
            <div id="login">
              <div>  
                <label htmlFor="login-user" className="user-label">Username</label>
                <input onFocus={this.transition} onKeyUp={this.setUser} type="username" id="login-user"/>
                <label htmlFor="login-pass" className="pass-label">Password</label>
                <input onFocus={this.transition} onKeyUp={this.setPass} onKeyUp={this.setPass} type="password" id="login-pass"/>
                {incorrect}
                <button id="login-button" onClick={this.handleLogin}>LOGIN</button>
              </div>
            </div>  
        )
    }
}