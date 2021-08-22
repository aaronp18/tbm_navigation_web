import React from 'react';
import {
    Header,
    List,
} from 'semantic-ui-react'

const StatItem = ({ header, value }) => {
    return (
        <List.Item>
            <List.Content floated='right'>
                {value}
            </List.Content>
            <List.Content><Header as='h3'>{header}</Header></List.Content>
        </List.Item>
    )
}


export default StatItem