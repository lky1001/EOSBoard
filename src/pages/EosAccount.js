import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';
import Grid from '@material-ui/core/Grid';
import AccountInfo from '../components/AccountInfo';

class EosAccount extends Component {
    state = {
        accountLoaded : false
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        const { accountName, accountInfo, loadMyAccountInfo } = nextProps;
        const { accountLoaded } = this.state;

        if(accountName && !accountLoaded){
            loadMyAccountInfo(accountName);
            this.setState({
                accountLoaded : true
            })
        }

        return accountInfo ? true : false;
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