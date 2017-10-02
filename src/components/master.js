import React from "react";
import {Link} from "react-router";
import {LoginLink} from "react-router";
import Header from "./header";

export default class MasterPage extends React.Component {
    render() {
        return (
            <div className="master">
              <Header/>
              {this.props.children}
            </div>  
        )
    }
}