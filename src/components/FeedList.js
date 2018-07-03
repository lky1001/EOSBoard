import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Feed from './Feed';

class FeedList extends Component {
    render(){
        const { newsfeed, isInitialized } = this.props;

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
                            return <Feed author={feed.author} content={feed.content} created={feed.created} key={index}/>
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