import React from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Feed from './Feed';

const FeedList = ({newsfeed}) => {
  return (
    <Paper className="paper">
        <div className="newsfeedHeader">
            News Feed
        </div>
        <List component="nav">
            {
                newsfeed &&
                newsfeed.map((feed, index) => {
                        return <Feed author={feed.author} content={feed.content} created={feed.created} key={index}/>
                })
            }
        </List>
    </Paper>
  );
}

FeedList.defaultProps = {
    newsfeed : []
}

export default FeedList;