import React from 'react';
import {
    Button,
    CardGroup,
    Container,
    Grid,
} from 'semantic-ui-react'
import StatsCard from './StatsCard'

import rosLogic from '../utility/rosLogic';

import store from '../utility/store'
import GraphCard from './GraphCard';

let InfoPage = () => {
    store.statsTemp.forEach((stat) => {
        if (stat.value === undefined)
            stat.value = "N/A";
    })

    const [state, setState] = React.useState({ stats: store.statsTemp });

    // Emulate onComponentMount
    React.useEffect(() => {
        rosLogic.initiateROS(state, setState);
        setInterval(() => {

            setState(prevState => {
                prevState.stats.find((stat) => stat.id === "pitch").value = Date.now();
                return { ...prevState };
            })

        }, 1000)
    }, []);

    return (
        <Container fluid style={{ margin: 20, padding: 20 }}>
            <Grid columns={2} stackable >

                <Grid.Row >
                    <Grid.Column>
                        <CardGroup>
                            {/* <StatCards stats={stats} /> */}
                            <StatsCard stats={state.stats}></StatsCard>
                            <GraphCard></GraphCard>
                        </CardGroup>
                    </Grid.Column>
                    <Grid.Column>

                    </Grid.Column>

                </Grid.Row>


            </Grid>
        </Container >)

}



export default InfoPage;