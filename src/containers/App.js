import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { NavLink } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import Routes from '../Routes';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../styles/App.scss';
import { withRoot } from '../contexts/RootContext';
import { ListItemText } from '@material-ui/core';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      left: false
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

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { identity, accountName } = this.props;
    const sideList = (
      <div>
        <List component="nav">
          <ListItem button component={NavLink} to='/'>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText inset primary="Dashboard" />
            </ListItem>
            <ListItem button component={NavLink} to='/timeline'>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
            <ListItemText inset primary="Timeline" />
          </ListItem>
        </List>
      </div>
    );

    return (
        <Router >
          <div className="App theme-dark">
            <AppBar className="appBar" position="static">
              <Toolbar>
                <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer('left', true)}>
                  <MenuIcon />
                </IconButton>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer('left', false)}
                    onKeyDown={this.toggleDrawer('left', false)}
                  >
                    {sideList}
                  </div>
                </Drawer>
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
                  <Typography variant="title" color="inherit" style={{width: "100%", textAlign: "left"}}>
                      Welcome {accountName}!
                  </Typography>    
                }
                <div className="app-title-layout">
                  <div>
                    <a href="https://github.com/lky1001/EOSBoard" color="inherit" className="github-link" target="_blank" rel="noopener noreferrer">
                      <SvgIcon>
                        <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                      </SvgIcon>
                    </a>
                  </div>
                </div>
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