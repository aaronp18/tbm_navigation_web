import React from 'react';
import {
    CardGroup,
    Container,
    Grid,
} from 'semantic-ui-react'
import StatsCard from './StatsCard'

import rosLogic from '../utility/rosLogic';

import store from '../utility/store'
import GraphCard from './GraphCard';

import TestsCard from './TestsCard';
import NavigationCard from './NavigationCard';
import TBMModel from './TBMModel';

import NavMenu from './NavMenu';


let InfoPage = () => {
    store.statsTemp.forEach((stat) => {
        if (stat.value === undefined)
            stat.value = "N/A";
        if (stat.update === undefined)
            stat.update = rosLogic.handleMessageStat;
    })
    for (const [key, listener] of Object.entries(store.otherListeners)) {
        if (listener.update === undefined)
            listener.update = rosLogic.handleOtherListener;
    }



    const [state, setState] = React.useState({
        stats: store.statsTemp, consumptions: store.consumptions,
        navigation: {
            targetPitch: 0,
            phases: store.navigationPhases,
        },
        status: store.statuses["notconnected"],
        otherListeners: store.otherListeners,
        isParamsRefreshing: false,
        params: store.paramsTemplate,
        settings: store.getSettings(),
    });

    // Emulate onComponentMount
    React.useEffect(() => {
        rosLogic.initiateROS(state, setState);

        // Setup check for webserver every 10 seconds
        setInterval(() => {
            fetch("/api/").then((response) => {
                let res = response.status === 200 ? store.statuses.on.text : store.statuses.off.text
                setState((prevState) => {
                    prevState.stats.find((stat) => stat.id === "web-status").value = res;
                    return { ...prevState }
                });
            }).catch((err) => {
                setState((prevState) => {
                    prevState.stats.find((stat) => stat.id === "web-status").value = store.statuses.off.text;
                    return { ...prevState }
                });
            })
        }, 10000)
    }, []);

    // If targetpitch has changed, then need to publish


    return (
        <>
            <NavMenu state={state} setState={setState}></NavMenu>
            <Container fluid style={{ margin: 20, padding: 20 }}>
                <Grid columns={2} stackable >

                    <Grid.Row >
                        <Grid.Column>
                            <CardGroup>

                                <StatsCard stats={state.stats} status={state.status}></StatsCard>
                                <NavigationCard state={state} setState={setState}></NavigationCard>
                                <TBMModel state={state}></TBMModel>
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
            </Container >

        </>)

}



export default InfoPage;

