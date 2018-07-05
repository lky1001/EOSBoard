import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Feed from './Feed';

class MyFeedList extends Component {
    render(){
        const { mynewsfeed, loginAccountName } = this.props;

        return (
            <Paper className="paper">
                <h3 className="newsfeedHeader" style={{paddingTop: "0px"}}>
                    News Feed
                </h3>
        
                <div>
                    <Fade   
                        in={!mynewsfeed} 
                        style={{
                            transitionDelay: !mynewsfeed ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </div>

                {mynewsfeed &&
                <List component="nav" style={{paddingBottom: "0px"}}>
                    {
                        mynewsfeed &&
                        mynewsfeed.map((feed, index) => {
                            return <Feed id={feed.id} author={feed.author} content={feed.content} created={feed.created} key={index} loginAccountName={loginAccountName}/>
                        })
                    }
                </List>}
            </Paper>
          )
    }
}

MyFeedList.defaultProps = {
    mynewsfeed : []
}

export default MyFeedList;