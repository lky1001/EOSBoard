import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TweetList from '../components/TweetList';
import TweetChart from '../components/TweetChart';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DashboardIcon from '@material-ui/icons/Dashboard';
import QnAIcon from '@material-ui/icons/QuestionAnswer';
import ExtIcon from '@material-ui/icons/Extension';
import * as Eos from 'eosjs';
import "../styles/Home.scss";

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
            latestTweets : [],
            navIndex : 0
        };

        document.addEventListener('scatterLoaded', scatterExtension => {
            this.load();
          });
    }
    
    load = () => {
        this.scatter = window.scatter;

        if (this.scatter) {
            this.eos = this.scatter.eos(NETWORK, Eos, CONFIG);
            
            this.loadLatestTweets();
        }
    }
    
    login = () => {
        const requirements = {accounts: [NETWORK]};
        return this.scatter.getIdentity(requirements);
    }
        
    logout = () => {
        this.scatter.forgetIdentity();
    }
    
    isLoggedIn = () => {
        return this.scatter && !!this.scatter.identity;
    }
    
    accountName = () => {
        if (!this.scatter || !this.scatter.identity) {
            return;
        }
    
        const account = this.scatter.identity.accounts.find(acc => acc.blockchain === NETWORK.blockchain);
        return account.name;
    }
    
    tweet = (title, msg) => {
        this.load();
        const account = this.scatter.identity.accounts.find(acc => acc.blockchain === NETWORK.blockchain);
        const options = {authorization: [`${account.name}@${account.authority}`]};
        return this.eos.contract(CONTRACT_NAME).then(contract => contract.write(account.name, title, msg, options));
    }

    handleTweet = async() => {
        const { msg } = this.state;
        const result = await this.tweet('', msg);
        console.log(result);

        this.setState({
            msg : ''
        });

        this.loadLatestTweets();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    loadLatestTweets = () =>{
        this.eos.getTableRows(true, CONTRACT_NAME, CONTRACT_NAME, TABLE_NAME, '', '' ,'' , 2000).then((data) => {
            let latestTweets = [];

            if (data.rows) {
                const sortedData = data.rows.reverse();
                sortedData.map(d => {
                    return latestTweets.push({author : d.author, content : d.content, created : new Date(d.created * 1000).toDateString()});
                });
            }

            return latestTweets;
        })
        .then((result) => {
            this.setState({
                latestTweets : result
            })
        });

    }

    handleNavChange = (event, value) => {
        console.log(value);
        this.setState({
            navIndex : value
        })
    }

    render(){
        const { msg } = this.state;
        
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
                            Say hello to the tweet box.
                        </Typography>
                    </div>
                </header>

                <section className="content">
                    <Paper className="writingTweetPaper">
                        <TextField
                            fullWidth
                            value={msg}
                            onChange={this.handleChange('msg')}
                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <Button variant="contained" color="primary" className="tweetBtn" onClick={this.handleTweet}>
                            Tweet
                        </Button>
                        
                    </Paper>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} md={8}>
                            <main>
                                <TweetList latestTweets={this.state.latestTweets}/>
                            </main>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <aside>
                                <Paper className="paper">
                                    <TweetChart/>
                                </Paper>
                            </aside>
                        </Grid>
                    </Grid>
                </section>
            </div>
        );
    }
};

export default Home;