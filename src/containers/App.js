import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { NavLink } from 'react-router-dom';
import Routes from '../Routes';
import * as Eos from 'eosjs';
import logo from '../statics/logo.svg';
import '../styles/App.scss';

const CONTRACT_NAME = "eos.board";

const requiredFields = {
  accounts:[
      {blockchain:'eos', host:'127.0.0.1', port:8888}
  ]
};

const scatterNetwork = {
  protocol:'http',
  blockchain: 'eos',
  host: '127.0.0.1',
  port: 8888,
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
};

const config = {
  broadcast: true,
  sign: true,
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
};


class App extends Component {
  
  constructor(props) {
    super(props);

    document.addEventListener('scatterLoaded', scatterExtension => {
      this.scatter = window.scatter;
      window.scatter = null;

      this.eos = this.scatter.eos(scatterNetwork, Eos, config);

    });
  }

  handleLogin = () => {
    if (this.scatter) {
      this.scatter.getIdentity().then(id => {
        if(!id) return false;

        
        this.scatter.useIdentity(id.hash);
        console.log('Possible identity', id);
      });
    } else {
      // todo - login eosjs with private key
    }
  };

  render() {
    
    return (
      <Router >
        <div className="App theme-dark">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                    component={NavLink}
                    to="/"
                    color="inherit">
              </IconButton>
              <Button color="inherit" onClick={this.handleLogin}>
                LOGIN
              </Button>
            </Toolbar>
          </AppBar>

          <div>
            <Routes />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;