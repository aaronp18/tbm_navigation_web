import React from 'react';
import {
    Grid,
    Header,
    List,
    Card,
} from 'semantic-ui-react'
import StatItem from './StatItem';
import StatusIcon from './StatusIcon';

const StatsCard = ({ status, stats }) => {
    // Stats 1
    let stats1 = stats.slice(0, stats.length / 2);
    let stats2 = stats.slice(stats.length / 2,);

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>
                <StatusIcon status={status} />Stats ({status.text} )


            </Header>

            <Grid stackable>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <List style={{ padding: 20 }} divided verticalAlign='middle'>
                            {stats1.map((stat) => (
                                <StatItem header={stat.name} key={stat.id} value={stat.value} isSubtitle={stat.isSubtitle} parseFunc={stat.parseFunc}></StatItem>
                            ))}
                        </List>

                    </Grid.Column>
                    <Grid.Column>
                        <List style={{ padding: 20 }} divided verticalAlign='middle'>
                            {stats2.map((stat) => (
                                <StatItem header={stat.name} key={stat.id} value={stat.value} isSubtitle={stat.isSubtitle} parseFunc={stat.parseFunc}></StatItem>
                            ))}

                        </List>

                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Card>

    )
}


export default StatsCard