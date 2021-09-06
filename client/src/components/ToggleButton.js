import React from 'react';
import {
    Button
} from 'semantic-ui-react'

const ToggleButton = ({ onClick, onText = "ON", offText = "OFF", toggled, fluid = false }) => {

    return (
        <Button fluid={fluid} onClick={onClick} active={toggled} toggle > {toggled ? onText : offText}</Button >
    )
}


export default ToggleButton