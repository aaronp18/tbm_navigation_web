import React, { useState } from 'react';
import {
    Header,
    Button,
    Card
} from 'semantic-ui-react'
import tests from '../utility/tests';


const TestsCard = () => {
    let initialState = {
        energyConsumptionTestRunning: false,
    }
    let [state, setState] = useState(initialState);

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Tests</Header>

            <Button onClick={() => tests.testEnergyConsumption(setState)}>Do Energy Consumption Test {state.energyConsumptionTestRunning ? "- Running..." : ""}</Button>
            <Button onClick={() => tests.test3DModel(setState)}>Do 3D Model Test {state.test3DModelRunning ? "- Running..." : ""}</Button>

        </Card>

    )
}


export default TestsCard