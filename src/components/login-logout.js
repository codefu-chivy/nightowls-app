import React from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router";
import {NotAuthenticated, Authenticated, LoginLink, LogoutLink} from "react-stormpath";


export default class LoginLogout extends React.Component {
    render() {
        return (
            <div>
                <NotAuthenticated><Link to="/register"><button className="user-auth">Sign Up</button></Link></NotAuthenticated>
                <NotAuthenticated><Link to="/login" className="log"><button className="user-auth">Login</button></Link></NotAuthenticated>
                <Authenticated><button className="user-auth"><LogoutLink className="log"/></button></Authenticated>
            </div>
        )
    }
}