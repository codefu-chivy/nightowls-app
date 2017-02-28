import React from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router";
import {NotAuthenticated, Authenticated, LoginLink, LogoutLink} from "react-stormpath";


export default class LoginLogout extends React.Component {
    render() {
        return (
            <div>
              <ul>
                <NotAuthenticated><li><Link to="/register"><button className="user-auth">Sign Up</button></Link></li></NotAuthenticated>
                <NotAuthenticated><li><button className="user-auth"><LoginLink className="log"/></button></li></NotAuthenticated>
                <Authenticated><li><button className="user-auth"><LogoutLink className="log"/></button></li></Authenticated>
              </ul>
            </div>
        )
    }
}