import React from "react";
import {LoginForm} from "react-stormpath";
import {DocumentTitle} from "react-document-title";

export default class Login extends React.Component {
    render() {
        return (
            <div>
              <h1 id="log-heading">Login</h1>
              <LoginForm id="login"/>
            </div>  
        )
    }
}