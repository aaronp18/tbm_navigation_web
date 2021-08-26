import React, { useState } from 'react';
import {
    Icon,
    IconGroup,
} from 'semantic-ui-react'
import tests from '../utility/tests';


const StatusIcon = ({ status }) => {
    return (

        <Icon.Group>
            <Icon name="circle outline" style={{ padding: 5 }} color={status.color} fitted size="small"></Icon>
        </Icon.Group>

    )
}


export default StatusIcon