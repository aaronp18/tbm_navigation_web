import React from 'react';
import {
    Header,
    List,
} from 'semantic-ui-react'

const StatItem = ({ header, value, isSubtitle, parseFunc }) => {
    if (isSubtitle) {
        return (

            <List.Item>
                <List.Content><Header as='h4' dividing style={{ textAlign: "center", fontStyle: "italic" }}>{header}</Header></List.Content>
            </List.Item>
        )
    }

    if (parseFunc) {
        value = parseFunc(value);
    }
    return (
        <List.Item>
            <List.Content floated='right'>
                {value}
            </List.Content>
            <List.Content><Header as='h4'>{header}</Header></List.Content>
        </List.Item>
    )
}


export default StatItem