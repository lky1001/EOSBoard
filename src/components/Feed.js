import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

const AVATAR_URL_BASE = "http://api.adorable.io/avatars/face"
const eyes = ["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"];
const nose = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];
const mouse = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];

const generateAvatarURL = () => {
    const targetEye = eyes[Math.floor((Math.random() * eyes.length))];
    const targetNose = nose[Math.floor((Math.random() * nose.length))];
    const targetMouse = mouse[Math.floor((Math.random() * mouse.length))];

    return (AVATAR_URL_BASE + ":" + targetEye + ":" + targetNose + ":" + targetMouse);
}

const Feed = (props) => {
    const {author, content, created} = props;
    const url = generateAvatarURL();

  return (
    <Fragment>
        <ListItem>
            <ListItemAvatar>
                <Avatar src={url}>
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