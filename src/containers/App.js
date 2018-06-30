import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { NavLink } from 'react-router-dom';
import Routes from '../Routes';
import Typography from '@material-ui/core/Typography';
import '../styles/App.scss';
import { withRoot } from '../contexts/RootContext';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      id: null
    };
  }

  handleLogin = async () => {
    const { login } = this.props;
    await login();
  }

  handleLogout = async () => {
    const { logout } = this.props;
    await logout();
  }

  render() {
    const { identity, accountName } = this.props;

    return (
        <Router >
          <div className="App theme-dark">
            <AppBar className="appBar" position="static">
              <Toolbar>
                <IconButton
                      component={NavLink}
                      to="/"
                      color="inherit">
                      <HomeIcon/>
                </IconButton>
                {
                  !identity &&
                  <Button color="inherit" onClick={this.handleLogin}>
                    LOGIN
                  </Button>
                }
                {
                  identity &&
                    <Button color="inherit" onClick={this.handleLogout}>
                      LOGOUT
                    </Button>
                }
                {
                  identity &&
                  <Typography variant="title" color="inherit">
                      Welcome {accountName}!
                  </Typography>    
                }
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

export default withRoot((App));