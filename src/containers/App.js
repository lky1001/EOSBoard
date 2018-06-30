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
import { EosProvider } from '../providers/EosProvider';

const CONTRACT_NAME = "eos.board";

const requiredFields = {
  accounts:[
      {blockchain:'eos', host:'127.0.0.1', port:8888, chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'}
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

    this.state = {
      id: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      this.scatter = window.scatter;

      this.eos = this.scatter.eos(scatterNetwork, Eos, config);

      if (this.scatter.identity) {
        this.setState({
          id: this.scatter.identity
        });
      }
    });
  }

  handleLogin = async () => {
    if (this.scatter) {
      let id = await this.scatter.getIdentity(requiredFields);
      
      if (id) {
        this.scatter.useIdentity(id);
        console.log('Possible identity', this.scatter.identity);
        this.setState({
          id: id
        });
      }
    } else {
      // todo - login eosjs with private key
    }
  };

  handleLogout = async () => {
    if (this.scatter) {
      let res = await this.scatter.forgetIdentity();

      console.log('logout : ' + res);

      this.setState({
        id: null
      });
    }
  }

  render() {
    
    return (
      <EosProvider>
        <Router >
          <div className="App theme-dark">
            <AppBar position="static">
              <Toolbar>
                <IconButton
                      component={NavLink}
                      to="/"
                      color="inherit">
                </IconButton>
                {
                  !this.state.id &&
                  <Button color="inherit" onClick={this.handleLogin}>
                    LOGIN
                  </Button>
                }
                {
                  this.state.id &&
                  // todo - username
                  <Button color="inherit" onClick={this.handleLogout}>
                    LOGOUT
                  </Button>
                }
              </Toolbar>
            </AppBar>

            <div>
              <Routes />
            </div>
          </div>
        </Router>
      </EosProvider>
    );
  }
}

export default App;