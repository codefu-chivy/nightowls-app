import React from "react";
import ReactDOM from "react-dom";
import {IndexRoute, Route, browserHistory, Router} from "react-router";
import MasterPage from "./components/master";
import Front from "./components/front";
import Login from "./components/login";
import Register from "./components/register"

const routes = (
      <Route path="/" component={MasterPage}>
        <IndexRoute component={Front}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </Route>
)

ReactDOM.render(
    <Router history={browserHistory}>
      {routes}
    </Router>, 
    document.getElementById("app-container")
);

