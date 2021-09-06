import React from 'react';
import {
    Button
} from 'semantic-ui-react'

const ToggleButton = ({ onClick, onText = "ON", offText = "OFF", toggled }) => {

    return (
        <Button onClick={onClick} active={toggled} toggle style={{ margin: 10 }}>{toggled ? onText : offText}</Button>
    )
}


export default ToggleButton