import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';
import Grid from '@material-ui/core/Grid';
import AccountInfo from '../components/AccountInfo';
import MyFeedList from '../components/MyFeedList';

class EosAccount extends Component {
    state = {
        accountLoaded : false
    }
    shouldComponentUpdate = async (nextProps, nextState) => {
        const { accountName, accountInfo, loadMyAccountInfo, loadMyFeeds, notifyFeedsUpdated } = nextProps;
        const { accountLoaded } = this.state;

        if(accountName && !accountLoaded){
            loadMyAccountInfo(accountName);
            const result = await loadMyFeeds();
            const resultLength = result.length;
            const nextUpperBound = (result && resultLength > 0 ? result[resultLength - 1].id : 0);
            notifyFeedsUpdated(result, nextUpperBound);
            this.setState({
                accountLoaded : true
            })
        }

        return accountInfo ? true : false;
    }

    render() {
         const { accountInfo, newsfeed } = this.props;

        return(
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6} md={4}>
                    <AccountInfo accountInfo={accountInfo} newsfeed={newsfeed}/>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <MyFeedList newsfeed={newsfeed}/>
                </Grid>
            </Grid>
        )
    }
}

export default withRoot(EosAccount);