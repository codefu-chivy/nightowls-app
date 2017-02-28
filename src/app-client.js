import React from "react";
import ReactDOM from "react-dom";
import {IndexRoute, Route, browserHistory} from "react-router";
import MasterPage from "./components/master";
import Front from "./components/front";
import ReactStormpath, { Router, HomeRoute, LoginRoute, AuthenticatedRoute } from "react-stormpath";
import Login from "./components/login";
import Register from "./components/register"

ReactStormpath.init({
    endpoints: {
        baseUri: "https://level-centaur.apps.stormpath.io"
    }    
});

const routes = (
      <HomeRoute path="/" component={MasterPage}>
        <IndexRoute component={Front}/>
        <LoginRoute path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </HomeRoute>
)

ReactDOM.render(
    <Router history={browserHistory}>
      {routes}
    </Router>, 
    document.getElementById("app-container")
);

