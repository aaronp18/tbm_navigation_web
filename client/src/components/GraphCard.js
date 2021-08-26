import { useState, useCallback, useRef } from 'react';
import {
    Card,
    Grid,
    Header,
    Container

} from 'semantic-ui-react'

import store from '../utility/store'
import ConsumptionGraph from './ConsumptionGraph';

export const useClientRect = () => {
    const [rect, setRect] = useState({ width: 0, height: 0 });
    const ref = useCallback(node => {
        if (node !== null) {
            const { width, height } = node.getBoundingClientRect();
            setRect({ width, height });
        }
    }, []);


    return [rect, ref];
};

const GraphCard = ({ dataPoints, header, }) => {
    const [rect, cardRef] = useClientRect();
    const { width, height } = rect; // Width / height of the card

    // Set the width of the graph depending on the breakpoint.
    let graphWidth = width > 425 ? width * 0.75 : width;
    return (

        <Card fluid style={{ padding: 10 }} >
            <div ref={cardRef} >
                <Header as={"h2"} dividing textAlign={'center'}>{header}</Header>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <ConsumptionGraph chartLabel={header} dataPoints={dataPoints} width={graphWidth} height={225} key={header}></ConsumptionGraph>
                        </Grid.Column >
                        <Grid.Column width={4}>
                            Hello
                        </Grid.Column >
                    </Grid.Row>
                </Grid>
            </div >
        </Card >

    )
}

export default GraphCard
