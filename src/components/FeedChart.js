import React, { Component } from 'react';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max} from 'd3-array';
import { AreaClosed } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { timeFormat } from 'd3-time-format';
import { withParentSize } from '@vx/responsive';

const margin = {
  top: 40,
  bottom: 60,
  left: 80,
  right: 40,
};

class FeedChart extends Component {
    render() {
        const { chartData, parentWidth, parentHeight } = this.props;

        const xMax = parentWidth - margin.left - margin.right;
        const yMax = parentHeight - margin.top - margin.bottom;
        const formatTime = timeFormat("%B %d");

        const x = d => new Date(d.date);
        const y = d => d.value;

        const xScale = scaleTime({
            range: [0, xMax],
            domain: extent(chartData, x),
        });

        const yScale = scaleLinear({
            range: [yMax, 0],
            domain: [0, max(chartData, y)],
            nice: true,
        });

        return(
            <svg width={parentWidth} height={parentHeight}>
                <Group top={margin.top} left={margin.left}>
                    <AxisLeft
                    scale={yScale}
                    top={0}
                    left={0}
                    label={'Feed per day'}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                    />
                    <AxisBottom
                        scale={xScale}
                        top={yMax}
                        label={'Days'}
                        stroke={'#1b1a1e'}
                        numTicks={7}
                        tickFormat={(value, index) => `${formatTime(value)}`}
                        tickTextFill={'#1b1a1e'}
                    />
                    <AreaClosed
                        data={chartData}
                        xScale={xScale}
                        yScale={yScale}
                        x={x}
                        y={y}
                    />
                </Group>
            </svg>
        )
    }
}

FeedChart.defaultProps = {
    chartData : []
}

export default withParentSize(FeedChart);