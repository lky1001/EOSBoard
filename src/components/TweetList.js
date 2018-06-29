import React from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Tweet from './Tweet';

const samples = [
    {
        nickName : "Julian",
        date :  new Date().toDateString()
    },
    {
        nickName : "James",
        date :  new Date().toDateString()
    },
    {
        nickName : "Vidic",
        date :  new Date().toDateString()
    },
    {
        nickName : "Herricane",
        date :  new Date().toDateString()
    },
    {
        nickName : "Salu",
        date :  new Date().toDateString()
    },
    {
        nickName : "Kovic",
        date :  new Date().toDateString()
    },
];

const TweetList = () => {
  return (
    <Paper className="paper">
        <div className="tweetlistHeader">
            Latest tweets
        </div>
        <List component="nav">
            {
                samples.map((i, index) => {
                    return <Tweet nickName={i.nickName} date={i.date} key={index}/>
                })
            }
        </List>
    </Paper>
  );
}

export default TweetList;