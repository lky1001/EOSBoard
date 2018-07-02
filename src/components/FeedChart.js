import React, { Component } from 'react';
import { appleStock } from '@vx/mock-data';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max} from 'd3-array';
import { AreaClosed } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { LinearGradient } from '@vx/gradient';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

const data = appleStock;
const width = 750;
const height = 400;

const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

const x = d => new Date(d.date);
const y = d => d.close;

const xScale = scaleTime({
  range: [0, xMax],
  domain: extent(data, x)
});

const yScale = scaleLinear({
  range: [yMax, 0],
  domain: [0, max(data, y)],
});

class FeedChart extends Component {
    render(){
        const { isInitialized, isLoading } = this.props;
        const loading = !isInitialized || isLoading;

        return(
            <Paper className="paper">
                <h3 className="newsfeedHeader">
                    Status
                </h3>

                <div>
                    <Fade   
                        in={loading} 
                        style={{
                            transitionDelay: loading ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </div>

                {!loading &&
                <svg width={width} height={height}>
                    <Group top={margin.top} left={margin.left}>
                        <LinearGradient
                            from='#fbc2eb'
                            to='#a6c1ee'
                            id='gradient'
                        />

                        <AxisLeft
                        scale={yScale}
                        top={0}
                        left={0}
                        label={'Feed per min'}
                        stroke={'#1b1a1e'}
                        tickTextFill={'#1b1a1e'}
                        />
                        <AxisBottom
                            scale={xScale}
                            top={yMax}
                            label={'Years'}
                            stroke={'#1b1a1e'}
                            tickTextFill={'#1b1a1e'}
                        />
                        <AreaClosed
                            data={data}
                            xScale={xScale}
                            yScale={yScale}
                            x={x}
                            y={y}
                            fill={"url(#gradient)"}
                            stroke={""}
                        />
                    </Group>
                </svg>}
            </Paper>
        )
    }
}

export default FeedChart;