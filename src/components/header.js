import React from "react";
import {Link} from "react-router";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: sessionStorage.getItem("token")
        }
    }
    handleLogout = () => {
        sessionStorage.removeItem("token");
        this.setState({
            token: null
        });
        window.location = "/";
    }
    render() {
        let logout = (this.state.token ? <li><button id="logout" onClick={this.handleLogout}>LOGOUT</button></li> : null);
        return (
            <div id="header">
                <ul id="user-list">
                    {this.state.token ? null : <Link to="/register"><li><button id="sign-up">SIGN UP</button></li></Link>}
                    {this.state.token ? null : <Link to="/login"><li><button id="sign-in">LOGIN</button></li></Link>}
                    {logout}
                </ul>
            </div>
        )
    }
}
