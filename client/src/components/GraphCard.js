import React from 'react';
import {
    Card,
    Header,

} from 'semantic-ui-react'

import store from '../utility/store'
import ConsumptionGraph from './ConsumptionGraph';

const GraphCard = () => {
    let dataPoints = [{ timestamp: 1629888012879, value: 2 }, { timestamp: 1629888013879, value: 2 }, { timestamp: 1629888019879, value: 10 }, { timestamp: 1629888062879, value: 3 }, { timestamp: 1629884012879, value: 2 },]
    return (
        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Stats</Header>
            <ConsumptionGraph chartLabel="Energy Consumption" dataPoints={dataPoints}></ConsumptionGraph>
        </Card>

    )
}

export default GraphCard

