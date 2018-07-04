import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FeedList from '../components/FeedList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import "../styles/Home.scss";
import { withRoot } from '../contexts/RootContext';
import AsideContainer from '../components/AsideContainer';

import SnackbarContent from "@material-ui/core/SnackbarContent";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";

const variantIcon = {
    error: ErrorIcon,
    warning: WarningIcon
  };
  
  const styles1 = theme => ({
    error: {
      backgroundColor: theme.palette.error.dark
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  });

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={classNames(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        {...other}
      />
    );
  }
  
  MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
  };
  
  const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
  

class Home extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            msg : '',
            navIndex : 0,
            isLoading : false
        };
    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);

        this.interval = setInterval(() => {
            const { loadBetweenLatestAndCurrentFeed } = this.props;

            loadBetweenLatestAndCurrentFeed();
        }, 10000);

        this.loginCheck = setInterval(() => {
            const { checkLoginState } = this.props;

            checkLoginState();
        }, 10000);
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
        clearInterval(this.loginCheck);
    }

    handlePostFeed = async() => {
        const { msg } = this.state;
        const { postFeed, loadBetweenLatestAndCurrentFeed } = this.props;

        const result = await postFeed('', msg);
        console.log(result);

        this.setState({
            msg : ''
        });

        loadBetweenLatestAndCurrentFeed();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleNavChange = (event, value) => {
        this.setState({
            navIndex : value
        })
    }

    handleScroll = async() => {
        const { isLoading } = this.state;
        const { newsfeed, loadMoreFeeds, notifyFeedsUpdated, nextUpperBound } = this.props;

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
            if(nextUpperBound <= 0) return;

            try
            {
                this.setState({
                    isLoading : true
                })

                const result = await loadMoreFeeds();
                const resultLength = result.length;
                const nextUpperBound = (result && resultLength > 0 ? result[resultLength - 1].id : 0);
                const newResult = [...newsfeed, ...result];

                notifyFeedsUpdated(newResult, nextUpperBound);

            }catch(err){
                console.log(err);
            }
            finally{
                this.setState({
                    isLoading : false
                })
            }
        }
    }

    render() {
        const { msg, isLoading } = this.state;
        const { newsfeed, isInitialized, chartData, identity } = this.props;

        return  (
            <div className="root">
                <header className="header">
                    <div className="headlineRegion" style={{margin: "35px"}}>
                        <Typography variant="display3">
                            FACEOS
                        </Typography>
                        <Typography variant="display1">
                            Say hello to the news feed.
                        </Typography>
                        {
                            !identity &&
                            <MySnackbarContentWrapper
                                style={{margin: "auto", marginTop: "10px"}}
                                variant="warning"
                                message="You must have installed and logged in Scatter (https://scatter-eos.com)"
                            />
                        }
                    </div>
                </header>

                <section className="content">
                    <Paper className="writingFeedPaper">
                        <TextField
                            fullWidth
                            placeholder="What's on your mind?"
                            value={msg}
                            onChange={this.handleChange('msg')}
                            disabled={!identity}
                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <Button variant="contained" className="post-btn" onClick={this.handlePostFeed} disabled={!identity}>
                            Post
                        </Button>
                        
                    </Paper>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} md={8}>
                            <main>
                                <FeedList newsfeed={newsfeed} isInitialized={isInitialized}/>
                                <div>
                                    <Fade   
                                        in={isLoading} 
                                        style={{
                                            transitionDelay: isLoading ? '800ms' : '0ms',
                                        }}
                                        unmountOnExit
                                    >
                                        <CircularProgress />
                                    </Fade>
                                </div>
                            </main>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <aside>
                                <AsideContainer isInitialized={isInitialized} chartData={chartData}/>
                            </aside>
                        </Grid>
                    </Grid>
                </section>
            </div>
        );
    }
};

export default withRoot((Home));
