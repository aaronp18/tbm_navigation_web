import React from 'react'
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
} from 'semantic-ui-react'
import OptionsPopup from './OptionsPopup'

const NavMenu = ({ state, setState }) => (

    <Menu inverted>

        <Menu.Item as='a' header>
            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
            Navigation
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
        <OptionsPopup state={state} setState={setState}></OptionsPopup>

    </Menu>

)

export default NavMenu
