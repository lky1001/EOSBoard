import React from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Tweet from './Tweet';

const TweetList = ({latestTweets}) => {
  return (
    <Paper className="paper">
        <div className="tweetlistHeader">
            Latest tweets
        </div>
        <List component="nav">
            {
                latestTweets.map((tweet, index) => {
                    return <Tweet author={tweet.author} content={tweet.content} created={tweet.created} key={index}/>
                })
            }
        </List>
    </Paper>
  );
}

export default TweetList;