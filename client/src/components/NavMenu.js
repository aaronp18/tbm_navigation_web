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

const NavMenu = () => (

    <Menu inverted>

        <Menu.Item as='a' header>
            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
            TBM Navigation
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
        <Menu.Item as='a'>Controller</Menu.Item>
        <Menu.Item as='a'>Config</Menu.Item>

    </Menu>

)

export default NavMenu
