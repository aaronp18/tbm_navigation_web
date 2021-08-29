import React from 'react';
import {
    Button, Form, Checkbox, List, Header, Divider
} from 'semantic-ui-react'

import store from '../utility/store'
import rosLogic from '../utility/rosLogic'





const Options = ({ state, setState }) => {
    const [isRefreshingParams, setRefreshingParams] = React.useState(false);
    const refreshParams = () => {
        setRefreshingParams(true);
        rosLogic.refreshAllParameters(state.params, setState);
        fetch("/api/params/refresh").finally(() => setRefreshingParams(false));
    }

    return (
        <Form>
            <Header as={"h2"} dividing textAlign={'center'}>Misc</Header>
            <Button loading={isRefreshingParams} onClick={refreshParams}></Button>


            <Header as={"h2"} dividing textAlign={'center'}>Parameters</Header>
            <List style={{ padding: 20 }} divided verticalAlign='middle'>

                {Object.entries(state.params).map(([num, param], key) => {
                    return (
                        <List.Item key={param.route}>
                            <List.Content floated='right'>
                                {param.value}
                            </List.Content>
                            <List.Content><Header as='h4'>{param.name}</Header></List.Content>
                        </List.Item>
                    )
                })}

            </List>

            <Button fluid loading={isRefreshingParams} onClick={refreshParams}>Refresh Parameters</Button>

            <Divider></Divider>


            <Form.Group widths='equal'>
                <Form.Input fluid label='Origin Latitude' value="59u947309" />
                <Form.Input fluid label='Origin Longitude' value="889u34n" />

            </Form.Group>



        </Form>
    )
}

export default Options;