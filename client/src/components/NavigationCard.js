import React from 'react';
import {
    Grid,
    Header,
    Card,
    Button,
    Statistic,
} from 'semantic-ui-react'

import store from '../utility/store';
import authentication from '../utility/authentication';

import parsing from '../utility/parsing'

function handlePhaseChange(e, { option, id }, state, setState,) {
    e.preventDefault();
    e.stopPropagation();

    // Check authentication
    if (!authentication.isAuthenticated(state.settings.auth))
        return false

    // Publish to ROS
    fetch(`/api/publish/${store.publishRoutes.phase}/${id}`,
        {
            method: "POST",
        }).then(async (response) => {
            let json = await response.json()
            if (!json.success) {
                console.error(`Publish failed: ${json.message}`)
            }

        });

}

let NavigationCard = ({ state, setState }) => {

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Navigation </Header>
            <Button.Group style={{ padding: 10 }}>
                {state.navigation.phases.map((phase) => {
                    return (<Button color={state.otherListeners.phase.value === phase?.id ? "green" : "grey"} onClick={(e) => handlePhaseChange(e, phase, state, setState)} key={phase.id}>{phase.title}</Button>)
                })}
            </Button.Group>
            <Grid style={{ padding: 10 }} stackable>
                <Grid.Row centered>
                    <Statistic label="Target Pitch" value={parsing.parseAngle(state.otherListeners.pitchTarget.value)} size="tiny"></Statistic>
                    <Statistic label="Pitch Delta" value={parsing.parseAngle(state.otherListeners.pitchDelta.value)} size="tiny"></Statistic>
                    <Statistic label="Current Pitch" value={parsing.parseAngle(state.stats.find((val) => val.id === "pitch").value)} size="tiny"></Statistic>
                </Grid.Row>
            </Grid>
        </Card>

    )
}


export default NavigationCard