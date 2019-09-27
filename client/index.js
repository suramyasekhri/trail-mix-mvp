/**
 * ************************************
 *
 * @module  index.js
 * @author
 * @date
 * @description entry point for application.  Hangs React app off of #contents in index.html
 *
 * ************************************
 */
import React from "react";
import { render } from "react-dom";
import App from "./App.jsx";
import TrailPage from "./TrailPage.jsx";
import FavsPage from "./FavsPage.jsx";
import Login from "../login/Login.jsx";
import Signup from "../login/Signup.jsx";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SimpleStorage from "react-simple-storage";
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';


// uses ReactRouter to route the paths for login, signup, and homepage
render(
    <div>
        <Router>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/signup" component={Signup} />
                <div className="nav-content-container">
                  <Route path="/homepage" component={App} />
                  <Route path="/trail/:id" component={TrailPage} />
                  <Route path="/favs" component={FavsPage} />
                </div>
            </Switch>
        </Router>
    </div>, document.getElementById("root")
);
