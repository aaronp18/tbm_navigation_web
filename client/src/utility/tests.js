
async function testEnergyConsumption(setState) {
    await setState((prevState) => {
        return { ...prevState, energyConsumptionTestRunning: true, }
    });
    fetch("/api/test/energy",).then(async (response) => {
        // Done
        console.log("Done!");
        await setState((prevState) => {
            return { ...prevState, energyConsumptionTestRunning: false, }
        });
    });
}


let exported = {
    testEnergyConsumption
}

export default exported;