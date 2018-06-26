import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './pages';

class Routes extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/' component={Home} />
              <Route render = { function() {
                return <h1>Not Found</h1>;
              }} />
            </Switch>
          );
    };
};

export default Routes;