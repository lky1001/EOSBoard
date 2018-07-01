import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import PersonIcon from '@material-ui/icons/Person';

const Feed = (props) => {
    const {author, content, created} = props;

  return (
    <Fragment>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <PersonIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={author} secondary={content}/>
            <ListItemText secondary={created} style={{textAlign: "right", width: "200px", marginRight: "0px"}}/>
        </ListItem>
        <Divider/>
    </Fragment>
  );
}

export default Feed;