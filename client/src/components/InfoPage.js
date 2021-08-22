import React from 'react';
import {
    CardGroup,
    Container,
    Grid,
} from 'semantic-ui-react'
import StatsCard from './StatsCard'

let statsTemp = [
    {
        "name": "Heading",
        "id": "heading",
        "value": "N/A"
    }, {
        "name": "Pitch",
        "id": "pitch",
        "value": "N/AA"
    },
]

let intervalID = null;

const initateROS = () => {


}


let InfoPage = () => {
    const [state, setState] = React.useState({ stats: statsTemp });

    // Emulate onComponentMount
    React.useEffect(() => {
        initateROS()
        intervalID = setInterval(() => {

            setState(prevState => {
                prevState.stats.find((stat) => stat.id === "pitch").value = Date.now();
                // console.log("State changed " + prevState.stats.find((stat) => stat.id === "pitch").value);
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
                        </CardGroup>

                    </Grid.Column>


                </Grid.Row>


            </Grid>
        </Container >)

}



export default InfoPage;