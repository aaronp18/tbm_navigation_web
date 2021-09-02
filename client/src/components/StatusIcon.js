import React from 'react';
import {
    Icon,
} from 'semantic-ui-react'


const StatusIcon = ({ status }) => {
    return (

        <Icon.Group>
            <Icon name="circle outline" style={{ padding: 5 }} color={status.color} fitted size="small"></Icon>
        </Icon.Group>

    )
}


export default StatusIcon