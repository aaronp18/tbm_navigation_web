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

import TestsCard from './TestsCard';

let InfoPage = () => {
    store.statsTemp.forEach((stat) => {
        if (stat.value === undefined)
            stat.value = "N/A";
        if (stat.update === undefined)
            stat.update = rosLogic.handleMessageStat;
    })

    const [state, setState] = React.useState({ stats: store.statsTemp, consumptions: store.consumptions });

    // Emulate onComponentMount
    React.useEffect(() => {
        rosLogic.initiateROS(state, setState);
    }, []);

    return (
        <Container fluid style={{ margin: 20, padding: 20 }}>
            <Grid columns={2} stackable >

                <Grid.Row >
                    <Grid.Column>
                        <CardGroup>

                            <StatsCard stats={state.stats}></StatsCard>
                            <TestsCard></TestsCard>



                        </CardGroup>
                    </Grid.Column>
                    <Grid.Column>
                        <CardGroup>
                            {state.consumptions.map((consumption) => {
                                return (<GraphCard dataPoints={consumption.dataPoints} header={consumption.header} total={consumption.total} average={consumption.average} key={consumption.name}></GraphCard>)
                            })}
                        </CardGroup>
                    </Grid.Column>

                </Grid.Row>


            </Grid>
        </Container >)

}



export default InfoPage;

