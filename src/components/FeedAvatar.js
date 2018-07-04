import React, { Component } from 'react';
import { Avatar } from '@material-ui/core';
import ecc from 'eosjs-ecc'

const AVATAR_URL_BASE = "http://api.adorable.io/avatars/face"
const eyes = ["eyes1","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes8","eyes9"];
const nose = ["nose1","nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];
const mouse = ["mouth1","mouth2","mouth3","mouth4","mouth5","mouth6","mouth7","mouth8","mouth9"];

const generateAvatarURL = (index) => {
    const targetEye = eyes[index];
    const targetNose = nose[index];
    const targetMouse = mouse[index];

    return (AVATAR_URL_BASE + ":" + targetEye + ":" + targetNose + ":" + targetMouse);
}

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

        const hash = ecc.sha256(author);
        const indexForPerson =  parseInt(hash, 16) % 10;
        const url = generateAvatarURL(indexForPerson);

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