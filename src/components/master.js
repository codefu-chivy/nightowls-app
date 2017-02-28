import React from "react";
import {Link} from "react-router";
import {LoginLink} from "react-router";
import LoginLogout from "./login-logout";

export default class MasterPage extends React.Component {
    render() {
        return (
            <div className="master">
              <LoginLogout/>
              {this.props.children}
            </div>  
        )
    }
}