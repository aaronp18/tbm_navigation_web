import React, { useState, useMemo, useRef, useResource } from 'react';
import {
    Grid,
    Header,
    Button,
    Divider,
    Card
} from 'semantic-ui-react'

import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, MapControls } from "@react-three/drei";
import * as THREE from "three";
import store from '../utility/store'
import TBM from './TBM'


const TBMModel = ({ state }) => {

    // First check if connected to ROS
    if (state.status !== store.statuses.connected || false)
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
                <MapCameraControls />

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

const OrbitCameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <OrbitControls ref={controls} args={[camera, domElement]} />;
};
const MapCameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <MapControls ref={controls} args={[camera, domElement]} />;
};


export default TBMModel