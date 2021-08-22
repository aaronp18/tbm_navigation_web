import React from 'react';
import {
    Container,
    Card,
    Segment,
    Header,
    Icon,
    Button
} from 'semantic-ui-react'

const SegmentCard = () => (
    <Card fluid>
        <Segment placeholder >
            <Header icon>
                <Icon name='pdf file outline' />
                WIP - Not implemented yet
            </Header>
            <Button primary>Add Document</Button>
        </Segment>
    </Card>
)

export default SegmentCard;