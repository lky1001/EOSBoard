import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Timeline, EosAccount } from './pages';

class Routes extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/timeline' component={Timeline} />
              <Route component={EosAccount} />
            </Switch>
          );
    };
};

export default Routes;