import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Feed from './Feed';

class FeedList extends Component {
    render(){
        const { newsfeed, isInitialized, loginAccountName } = this.props;
        const { handleRemoveFeed } = this.props;

        return (
            <Paper className="paper">
                <h3 className="newsfeedHeader">
                    News Feed
                </h3>
        
                <div>
                    <Fade   
                        in={!isInitialized} 
                        style={{
                            transitionDelay: !isInitialized ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </div>

                {isInitialized &&
                <List component="nav">
                    {
                        newsfeed &&
                        newsfeed.map((feed, index) => {
                            return <Feed id={feed.id} author={feed.author} content={feed.content} created={feed.created} key={index} removeFeed={handleRemoveFeed} loginAccountName={loginAccountName}/>
                        })
                    }
                </List>}
            </Paper>
          )
    }
}

FeedList.defaultProps = {
    newsfeed : []
}

export default FeedList;