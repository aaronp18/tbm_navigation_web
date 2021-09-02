import React, { useState, useMemo, useRef } from 'react';
import {
    Grid,
    Header,
    Button,
    Divider,
    Card
} from 'semantic-ui-react'

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import store from '../utility/store'
import TBM from './TBM'


const TBMModel = ({ state }) => {
    // First check if connected to ROS
    if (state.status !== store.statuses.connected)
        return (
            <Card fluid style={{ padding: 10 }}>
                <Header as={"h2"} dividing textAlign={'center'}>TBM Model</Header>
                <Header as={"h4"} textAlign={"center"}>Not Connected!</Header>
                <Divider></Divider>

            </Card>
        );

    // Get coords
    let { pitch, yaw, roll, x, y, z } = getCoords(state.stats);

    return (

        <Card fluid style={{ padding: 10 }}>
            <Header as={"h2"} dividing textAlign={'center'}>TBM Model</Header>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <TBM position={[x, y, z]} rotation={[pitch, yaw, roll]} />
            </Canvas>

        </Card>

    )
}


function getCoords(stats) {

    let coordsIDs = ["pitch", "yaw", "roll", "x", "y", "z"];
    let coords = {}
    coordsIDs.forEach((id) => {
        // If doesnt contain value (or N/A), then set to 0 
        let val = stats.find((stat) => stat.id === id)?.value ?? 0;
        coords[id] = val === "N/A" ? 0 : val;
    })
    return coords;


}

export default TBMModel