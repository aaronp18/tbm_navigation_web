import React from 'react';
import {
    Grid,
    Header,
    List,
    Card,
    Button,
    Statistic,
} from 'semantic-ui-react'

import store from '../utility/store';

function handlePhaseChange(e, { option, id }, setState) {
    e.preventDefault();
    e.stopPropagation();


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

    // setState((prevState) => {
    //     prevState.navigation.phases.forEach((phase) => phase.selected = false);
    //     let found = prevState.navigation.phases.find((phase) => phase.name === name);
    //     found.selected = true;



    //     return { ...prevState };
    // });
}

let NavigationCard = ({ state, setState }) => {

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Navigation </Header>
            <Button.Group style={{ padding: 10 }}>
                {state.navigation.phases.map((phase) => {
                    return (<Button color={state.otherListeners.phase.value === phase?.id ? "green" : "grey"} onClick={(e) => handlePhaseChange(e, phase, setState)} key={phase.id}>{phase.title}</Button>)
                })}
            </Button.Group>
            <Grid style={{ padding: 10 }} stackable>
                <Grid.Row centered>
                    <Statistic label="Target Pitch" value={state.otherListeners.pitchTarget.value}></Statistic>
                    <Statistic label="Current Pitch" value={state.stats.find((val) => val.id === "pitch").value}></Statistic>
                </Grid.Row>
            </Grid>
        </Card>

    )
}


export default NavigationCard