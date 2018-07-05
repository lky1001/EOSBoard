import React, { Component } from 'react';
import "../styles/EosAccount.scss";
import { withRoot } from '../contexts/RootContext';
import { Grid } from '@material-ui/core/Grid';
import FeedList from '../components/FeedList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

class EosAccount extends Component {
    state = {
        accountName : ''
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { accountName } = nextProps;

        if(this.state.accountName !== accountName){
            this.setState({
                accountName
            });

            return true;
        }else {
            return false;
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        const { isInitialized, loadMyAccountInfo, accountName } = this.props;

        if(accountName){
            loadMyAccountInfo(accountName);
        }
    }

    render() {
        return(
            <div></div>
            /* <Grid container spacing={24}>
                <Grid item xs={12} sm={6} md={4}>
                    <Fade   
                        in={!isInitialized} 
                        style={{
                            transitionDelay: !isInitialized ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                </Grid>
            </Grid> */
        )
    }
}

export default withRoot((EosAccount));