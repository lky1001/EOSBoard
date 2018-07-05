import React, { Component } from 'react';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import * as avatarService from '../services/AvatarService';
import '../styles/AccountInfo.scss';
import { Typography } from '@material-ui/core';

class AccountInfo extends Component {
    render() {
        const { accountInfo, newfeed } = this.props;
        // const { privileged, ram_quota, net_weight, cpu_weight,net_limit,cpu_limit,ram_usage,total_resources,self_delegated_bandwidth,voter_info } = accountInfo;

        console.log(newfeed);
        return(
        <Paper className="paper">
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
                <div className="row">
                    <Avatar className="avatar" src={avatarService.generateAvatarURL(accountInfo["account_name"])}/>
                    <Typography>Account :  {accountInfo["account_name"]}</Typography>
                    <Typography>Ram quota :  {accountInfo["ram_quota"]}</Typography>
                    <Typography>Ram usage :  {accountInfo["ram_usage"]}</Typography>
                    <Typography>Net weight :  {accountInfo["net_weight"]}</Typography>
                    <Typography>Cpu weight :  {accountInfo["cpu_weight"]}</Typography>
                </div>}
        </Paper>
        )
    };
}

export default AccountInfo;