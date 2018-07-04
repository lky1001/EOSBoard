import React, { Component, Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import FeedAvatar from './FeedAvatar';

const Feed = (props) => {
    const {author, content, created} = props;
    
  return (
    <Fragment>
        <ListItem>
            <ListItemAvatar>
                <FeedAvatar author={author}/>
            </ListItemAvatar>
            <ListItemText primary={author} secondary={content}/>
            <ListItemText secondary={created} style={{textAlign: "right", width: "200px", marginRight: "0px"}}/>
        </ListItem>
        <Divider/>
    </Fragment>
  );
}

export default Feed;