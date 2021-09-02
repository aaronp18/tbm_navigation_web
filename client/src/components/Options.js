import React from 'react';
import {
    Button, Form, Header, Divider
} from 'semantic-ui-react'

import rosLogic from '../utility/rosLogic'

import persistentStore from 'store';
import store from '../utility/store';





const Options = ({ state, setState, setOpen }) => {
    const [isRefreshingParams, setRefreshingParams] = React.useState(false);
    const handleRefreshParams = () => {
        setRefreshingParams(true);
        rosLogic.refreshAllParameters(state.params, setState);
        fetch("/api/params/refresh").finally(() => setRefreshingParams(false));
    }

    const handleSaveParams = () => {
        if (state.status.id !== "connected") {
            console.log("Not Connected to ROS Server...");
            setOpen(false)
            return;

        }
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

    const [settings, setSettings] = React.useState(state.settings);

    const onSettingChange = (e, { name, value }) => {
        // Save setting to variable
        setSettings((prevSettings) => {
            prevSettings[name] = value;
            return { ...prevSettings };
        })
    };

    const handleSaveSettings = () => {
        // Save to storage
        persistentStore.set("settings", settings);
    }

    return (
        <Form>
            <Header as={"h2"} dividing textAlign={'center'}>Authentication</Header>
            <Form.Field inline fluid name="auth" label="Authentication: "
                control={Form.Input} value={settings.auth} type="password" onChange={onSettingChange} />


            <Header as={"h2"} dividing textAlign={'center'}>Parameters - {state.status.text}</Header>
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
                onClick={(e) => {
                    e.preventDefault();
                    // Save parameters
                    handleSaveParams();
                    // Save settings
                    handleSaveSettings();
                }}

                positive
            />

            <Button
                content="Clear Settings"
                labelPosition='right'
                icon='trash alternate'
                floated={"right"}
                onClick={(e) => {
                    e.preventDefault();
                    // Clear persistent settings
                    persistentStore.remove("settings");
                    // Reset state
                    setState((prevState) => {
                        prevState.settings = store.getSettings();
                        return ({ ...prevState })
                    })

                    setSettings(store.getSettings());


                }}

                negative
            />


        </Form>
    )
}

export default Options;