
async function testEnergyConsumption(setState) {
    await setState((prevState) => {
        return { ...prevState, energyConsumptionTestRunning: true, }
    });
    fetch("/test/energy",).then(async (response) => {
        let res = await response.json();
        console.log(res.message);

        await setState((prevState) => {
            return { ...prevState, energyConsumptionTestRunning: false, }
        });
    });
}

async function test3DModel(setState) {
    await setState((prevState) => {
        return { ...prevState, test3DModelRunning: true, }
    });
    fetch("/test/3d",).then(async (response) => {
        let res = await response.json();

        console.log(res.message);

        await setState((prevState) => {
            return { ...prevState, test3DModelRunning: false, }
        });
    });
}


let exported = {
    testEnergyConsumption,
    test3DModel,
}

export default exported;