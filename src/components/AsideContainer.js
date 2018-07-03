import React, { Component } from 'react';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import FeedChart from './FeedChart';
import sizeMe from 'react-sizeme';

class AsideContainer extends Component {
    render() {
        const { isInitialized, chartData, size } = this.props;
        const width = Math.floor(size.width);

        return(
        <Paper className="paper">
            <h3 className="newsfeedHeader">
                Status
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
                <FeedChart chartData={chartData} parentWidth={width} parentHeight={width}/>
            }
        </Paper>
        )
    };
}

export default sizeMe()(AsideContainer);