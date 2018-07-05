import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, EosAccount } from './pages';

class Routes extends Component {
    render() {
        return (
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/account' component={EosAccount} />
            </Switch>
          );
    };
};

export default Routes;