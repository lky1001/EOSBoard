import React, { Component } from 'react'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import * as avatarService from '../services/AvatarService'
import '../styles/AccountInfo.scss'
import { Typography } from '@material-ui/core'

const styles = {
  title: {
    marginBottom: 16,
    fontSize: 14
  }
}
class AccountInfo extends Component {
  render() {
    const { accountInfo, classes } = this.props
    // const { privileged, ram_quota, net_weight, cpu_weight,net_limit,cpu_limit,ram_usage,total_resources,self_delegated_bandwidth,voter_info } = accountInfo;

    return (
      <Paper className="paper">
        <div>
          <Fade
            in={!accountInfo}
            style={{
              transitionDelay: !accountInfo ? '800ms' : '0ms'
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </div>

        {accountInfo && (
          <div className="row">
            <Avatar
              className="avatar"
              src={avatarService.generateAvatarURL(accountInfo['account_name'])}
            />
            <Typography className={classes.title}>
              Account : {accountInfo['account_name']}
            </Typography>
            <Typography className={classes.title}>
              Ram quota : {accountInfo['ram_quota']}
            </Typography>
            <Typography className={classes.title}>
              Ram usage : {accountInfo['ram_usage']}
            </Typography>
            <Typography className={classes.title}>
              Net weight : {accountInfo['net_weight']}
            </Typography>
            <Typography className={classes.title}>
              Cpu weight : {accountInfo['cpu_weight']}
            </Typography>
          </div>
        )}
      </Paper>
    )
  }
}

AccountInfo.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AccountInfo)
