import React, { Component } from 'react';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class AccountInfo extends Component {
    render() {
        const { accountInfo } = this.props;

        return(
        <Paper className="paper">
            <Grid item xs={12} sm={6} md={4}>
                <Fade   
                    in={!accountInfo} 
                    style={{
                        transitionDelay: !accountInfo ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>

                <Paper>
                    {accountInfo && accountInfo["account_name"]}
                </Paper>
            </Grid>
        </Paper>
        )
    };
}

export default AccountInfo;