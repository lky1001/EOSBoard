import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Timeline } from './pages';

class Routes extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/timeline' component={Timeline} />
              <Route render = { function() {
                return <h1>Not Found</h1>;
              }} />
            </Switch>
          );
    };
};

export default Routes;