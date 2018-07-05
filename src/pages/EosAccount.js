import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { Typography } from '@material-ui/core';
import AccountInfo from '../components/AccountInfo';

class EosAccount extends Component {
    componentWillUpdate = (nextProps, nextState) => {
        const { loadMyAccountInfo, accountName } = this.props;

        if(accountName){
            loadMyAccountInfo(accountName);
        }
    }

    render() {
        const { accountInfo } = this.props;

        return(
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6} md={4}>
                    <AccountInfo accountInfo={accountInfo}/>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                </Grid>
            </Grid>
        )
    }
}

export default withRoot(EosAccount);