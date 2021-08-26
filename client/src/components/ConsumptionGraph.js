import React from 'react';
import {
    CardGroup,
    Container,
    Grid,
} from 'semantic-ui-react'

import store from '../utility/store'

import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';



const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
        x: [
            {
                type: "time",
                time: {
                    unit: 'month'
                },
                ticks: {
                    beginAtZero: true,
                },
            }
        ]
    },
};

const ConsumptionGraph = ({ dataPoints, chartLabel }) => {
    let labelPoints = [];
    let valuePoints = [];
    dataPoints.forEach(dataPoint => {
        labelPoints.push(dataPoint.timestamp);
        valuePoints.push(dataPoint.value);
    });

    let chartData = {
        labels: labelPoints,
        datasets: [
            {
                label: chartLabel,
                data: valuePoints,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };



    return (
        <Line data={chartData} options={options} title={chartLabel} />
    )
}

export default ConsumptionGraph;