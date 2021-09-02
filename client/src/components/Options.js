import React from 'react';
import {
    Button, Form, Header, Divider
} from 'semantic-ui-react'

import rosLogic from '../utility/rosLogic'





const Options = ({ state, setState, setOpen }) => {
    const [isRefreshingParams, setRefreshingParams] = React.useState(false);
    const handleRefreshParams = () => {
        setRefreshingParams(true);
        rosLogic.refreshAllParameters(state.params, setState);
        fetch("/api/params/refresh").finally(() => setRefreshingParams(false));
    }

    const handleSaveParams = () => {
        // Save all params
        Object.entries(tempParams).forEach(([key, newParam], index) => {
            rosLogic.setParamObj(newParam, newParam.value);
        })

        //Refresh params
        handleRefreshParams();

        setOpen(false)

    }

    const [tempParams, setTempParams] = React.useState(state.params);

    const onValueChange = (e, { name, value }) => {
        setTempParams((prev) => {
            prev[name].value = value;
            return ({ ...prev, })
        });
    };

    return (
        <Form>
            <Header as={"h2"} dividing textAlign={'center'}>Parameters</Header>
            {Object.entries(tempParams).map(([key, param], num) => {
                return (
                    <Form.Field inline fluid name={key} key={key} label={param.name} control={Form.Input} value={param.value} onChange={onValueChange} />
                )
            })}

            <Button fluid loading={isRefreshingParams} onClick={handleRefreshParams}>Refresh Parameters</Button>
            <Divider></Divider>
            <Button fluid onClick={handleSaveParams}>Save Parameters</Button>

            <Divider></Divider>

            <Button
                content="Save"
                labelPosition='right'
                icon='save'
                onClick={() => setOpen(false)}
                positive
            />


        </Form>
    )
}

export default Options;