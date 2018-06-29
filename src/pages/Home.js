import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import "../styles/Home.scss";
import TweetList from '../components/TweetList';

class Home extends Component {
    render(){
        return  (
            <div className="root">
                <header className="header">
                    Welcome to the EOS tweet.
                </header>

                <section className="content">
                    <Paper className="writingTweetPaper">
                        <TextField fullWidth/>
                        <Button variant="contained" color="primary" className="tweetBtn">
                            Tweet
                        </Button>
                    </Paper>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} md={8}>
                            <main>
                                <TweetList/>
                            </main>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <aside>
                                <Paper className="paper">Chart goes here.</Paper>
                            </aside>
                        </Grid>
                    </Grid>
                </section>
            </div>
        );
    }
};

export default Home;