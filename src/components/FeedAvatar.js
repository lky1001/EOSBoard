import React, { Component } from 'react';
import { Avatar } from '@material-ui/core';
import * as avatarService from '../services/AvatarService';

class FeedAvatar extends Component {
    state = {
        author : '',
        url : ''
    }
    
    shouldComponentUpdate = (nextProps, nextState) =>{
        return (nextProps.author === this.state.author ? false : true);
    }

    componentDidMount = () =>{
        const { author } = this.props;

        const url = avatarService.generateAvatarURL(author);

        this.setState({
            author,
            url
        });
    }

    render(){
        const { url } = this.state;
        
        return(
            <Avatar src={url}/>
        )
    }
}

export default FeedAvatar;