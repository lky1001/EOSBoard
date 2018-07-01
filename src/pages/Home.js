import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FeedList from '../components/FeedList';
import FeedChart from '../components/FeedChart';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import DashboardIcon from '@material-ui/icons/Dashboard';
import QnAIcon from '@material-ui/icons/QuestionAnswer';
import ExtIcon from '@material-ui/icons/Extension';
import "../styles/Home.scss";
import { withRoot } from '../contexts/RootContext';

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
        const { newsfeed } = this.props;
        
        return  (
            <div className="root">
                <header className="header">
                    <BottomNavigation className="nav"
                        onChange={this.handleNavChange}
                        showLabels>
                        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
                        <BottomNavigationAction label="History" icon={<QnAIcon />} />
                        <BottomNavigationAction label="Settings" icon={<ExtIcon />} />
                    </BottomNavigation>

                    <div className="headlineRegion">
                        <Typography variant="display4">
                            FACEOS
                        </Typography>
                        <Typography variant="display2">
                            Say hello to the news feed.
                        </Typography>
                    </div>
                </header>

                <section className="content">
                    <Paper className="writingFeedPaper">
                        <TextField
                            fullWidth
                            placeholder="What's on your mind?"
                            value={msg}
                            onChange={this.handleChange('msg')}
                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <Button variant="contained" color="primary" className="postBtn" onClick={this.handlePostFeed}>
                            Post
                        </Button>
                        
                    </Paper>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} md={8}>
                            <main>
                                <FeedList newsfeed={newsfeed}/>
                                    {
                                        isLoading &&
                                        <CircularProgress size={50} />
                                    }
                            </main>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <aside>
                                <Paper className="paper">
                                    <FeedChart/>
                                </Paper>
                            </aside>
                        </Grid>
                    </Grid>
                </section>
            </div>
        );
    }
};

export default withRoot((Home));