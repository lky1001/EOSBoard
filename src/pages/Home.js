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
import DashboardIcon from '@material-ui/icons/Dashboard';
import QnAIcon from '@material-ui/icons/QuestionAnswer';
import ExtIcon from '@material-ui/icons/Extension';
import "../styles/Home.scss";
import { withRoot } from '../contexts/RootContext';

const CONTRACT_NAME = "board";
const TABLE_NAME = "mcontent";
const NETWORK = {
    protocol:'http',
    blockchain: 'eos',
    host: '127.0.0.1',
    port: '8888',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const CONFIG = {
    broadcast: true,
    sign: true,
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
};

class Home extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            msg : '',
            navIndex : 0
        };
    }

    handlePost = async() => {
        const { msg } = this.state;
        const { doPost, loadLastPost } = this.props;

        const result = await doPost('', msg);
        console.log(result);

        this.setState({
            msg : ''
        });

        loadLastPost();        
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleNavChange = (event, value) => {
        console.log(value);
        this.setState({
            navIndex : value
        })
    }

    render(){
        const { msg } = this.state;
        const { posts } = this.props;
        
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
                            value={msg}
                            onChange={this.handleChange('msg')}
                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <Button variant="contained" color="primary" className="postBtn" onClick={this.handlePost}>
                            Post
                        </Button>
                        
                    </Paper>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} md={8}>
                            <main>
                                <FeedList newsfeed={posts}/>
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