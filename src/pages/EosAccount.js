import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';
import Grid from '@material-ui/core/Grid';
import AccountInfo from '../components/AccountInfo';
import MyFeedList from '../components/MyFeedList';

class EosAccount extends Component {
    componentDidMount = async () => {
        const { scatter, setScatter } = this.props;

        if(!scatter){
            document.addEventListener('scatterLoaded', scatterExtension => {
                console.log('scatterloaded');
                const scatter = window.scatter;
                setScatter(scatter);
                this.scatterLoaded(scatter);
            });
        }else {
            this.scatterLoaded(scatter);
        }
    }

    scatterLoaded = () => {
        const { eosAccountPageLoaded } = this.props;
        eosAccountPageLoaded();
    }

    render() {
         const { accountInfo, mynewsfeed } = this.props;

        return(
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6} md={4}>
                    <AccountInfo accountInfo={accountInfo}/>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <MyFeedList mynewsfeed={mynewsfeed}/>
                </Grid>
            </Grid>
        )
    }
}

export default withRoot(EosAccount);