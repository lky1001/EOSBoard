import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import FeedChart from './FeedChart';
import sizeMe from 'react-sizeme';

class AsideContainer extends Component {
    render() {
        const { chartData, size } = this.props;
        const width = Math.floor(size.width);

        return(
        <Paper className="paper">
            <h3 className="newsfeedHeader" style={{paddingTop: "0px"}}>
                Status
            </h3>

            <FeedChart chartData={chartData} parentWidth={width} parentHeight={width}/>
        </Paper>
        )
    };
}

export default sizeMe()(AsideContainer);