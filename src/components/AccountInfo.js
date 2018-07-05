import React, { Component } from 'react';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import * as avatarService from '../services/AvatarService';

class AccountInfo extends Component {
    render() {
        const { accountInfo } = this.props;
        // const { privileged, ram_quota, net_weight, cpu_weight,net_limit,cpu_limit,ram_usage,total_resources,self_delegated_bandwidth,voter_info } = accountInfo;

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

                {accountInfo &&
                <Paper>
                    {accountInfo["ram_quota"]}
                </Paper>}
            </Grid>
        </Paper>
        )
    };
}

export default AccountInfo;