import React from "react";
import {RegistrationForm} from "react-stormpath";
import {DocumentTitle} from "react-document-title";

export default class Register extends React.Component {
    render() {
        return (
          <div>
            <h1 id="reg-heading">Register</h1>
            <RegistrationForm id="register"/>
          </div>  
        )
    }
}