import React from 'react';
import {
    Modal, Menu
} from 'semantic-ui-react'

import Options from './Options';




const OptionsPopup = ({ state, setState }) => {
    const [open, setOpen] = React.useState(false)


    return (< Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Menu.Item as='a'>Config</Menu.Item>}

    >
        <Modal.Header>Navigation Configuration</Modal.Header>
        <Modal.Content >
            <Options state={state} setState={setState} setOpen={setOpen}></Options>
        </Modal.Content>

    </Modal >
    )
}

export default OptionsPopup;