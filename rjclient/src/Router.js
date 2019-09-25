import React from 'react';
import  App  from "./App.js";
import  Entry from "./Entry.js";
import { BrowserRouter, Route, Link } from "react-router-dom";


class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <BrowserRouter>
                <Route path="/" exact component={Entry} />
                <Route path="/app/" component={App} />
            </BrowserRouter>
        )
    };
}

export default Router;
