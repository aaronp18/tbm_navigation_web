import React from 'react';
import {
    Grid,
    Header,
    List,
    Card,
    Button,
    Statistic,
} from 'semantic-ui-react'


function handlePhaseChange({ name, option, }, setState) {

    setState((prevState) => {
        prevState.navigation.phases.forEach((phase) => phase.selected = false);
        let found = prevState.navigation.phases.find((phase) => phase.name === name);
        found.selected = true;

        // If phase contains target pitch, set
        if (option?.targetPitch)
            prevState.navigation.targetPitch = option.targetPitch;

        return { ...prevState };
    });
}

let NavigationCard = ({ state, setState }) => {

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Navigation </Header>
            <Button.Group style={{ padding: 10 }}>
                {state.navigation.phases.map((phase) => {
                    return (<Button color={phase?.selected ? "green" : "grey"} onClick={() => handlePhaseChange(phase, setState)} key={phase.name}>{phase.title}</Button>)
                })}
            </Button.Group>
            <Grid style={{ padding: 10 }} stackable>
                <Grid.Row centered>
                    <Statistic label="Target Pitch" value={state.navigation.targetPitch}></Statistic>
                    <Statistic label="Current Pitch" value={state.stats.find((val) => val.id === "pitch").value}></Statistic>
                </Grid.Row>
            </Grid>
        </Card>

    )
}


export default NavigationCard