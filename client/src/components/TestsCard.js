import React, { useState } from 'react';
import {
    Grid,
    Header,
    Button,
    Card
} from 'semantic-ui-react'
import tests from '../utility/tests';


const TestsCard = () => {
    let initalState = {
        energyConsumptionTestRunning: false,
    }
    let [state, setState] = useState(initalState);

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Tests</Header>

            <Button onClick={() => tests.testEnergyConsumption(setState)}>Do Energy Consumption Test {state.energyConsumptionTestRunning ? "- Running..." : ""}</Button>

        </Card>

    )
}


export default TestsCard