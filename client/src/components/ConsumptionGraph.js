import React from 'react';
import {
    CardGroup,
    Container,
    Grid,
} from 'semantic-ui-react'

import store from '../utility/store'

import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, HorizontalGridLines, VerticalGridLines, XAxis, YAxis } from 'react-vis';


const ConsumptionGraph = ({ dataPoints, chartLabel, width, height }) => {

    let data = dataPoints.map((datapoint, index) => ({ x: datapoint.timestamp, y: datapoint.value }))

    return (
        <XYPlot
            xType="time"
            width={width}
            height={height}
        >
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis title="Time" />
            <YAxis title={chartLabel} />
            <LineSeries
                data={data} />
        </XYPlot>
    )
}

export default ConsumptionGraph;