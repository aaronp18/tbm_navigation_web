import React from 'react';
import {
    Grid,
    Header,
    List,
    Card
} from 'semantic-ui-react'
import StatItem from './StatItem';

const StatsCard = ({ stats }) => {
    return (
        // <ul>
        //     {stats.map((stat) => (
        //         <li key={stat.id}>{stat.value}</li>
        //     ))}
        // </ul>

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>Stats</Header>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <List style={{ padding: 20 }} divided verticalAlign='middle'>
                            {stats.map((stat) => (
                                <StatItem header={stat.name} key={stat.id} value={stat.value}></StatItem>
                            ))}
                        </List>

                    </Grid.Column>
                    <Grid.Column>
                        <List style={{ padding: 20 }} divided verticalAlign='middle'>


                        </List>

                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Card>

    )
}


export default StatsCard