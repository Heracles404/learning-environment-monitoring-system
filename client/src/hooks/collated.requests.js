const API_URL = 'http://192.168.0.100:8000';

async function httpGetCollatedReadouts() {
    const response = await fetch(`${API_URL}/devices`);
    return await response.json();
}

async function httpGetReadoutsByClassroom(classroom) {
    const response = await fetch(`${API_URL}/sensors/classroom/${classroom}`);
    return await response.json();
}

async function httpFetchAllReadouts() {
    try {
        // Step 1: Get the collated readouts (devices)
        const devices = await httpGetCollatedReadouts();

        // Step 2: Create an array to hold promises for each classroom readout
        const readoutPromises = devices.map(async (device) => {
            const classroom = device.classroom;
            // Step 3: Fetch readouts for each classroom
            const readouts = await httpGetReadoutsByClassroom(classroom);
            return {
                classroom,
                readouts
            };
        });

        // Step 4: Wait for all promises to resolve
        const allReadouts = await Promise.all(readoutPromises);

        // Step 5: Do something with the allReadouts data
        console.log(allReadouts);
    } catch (error) {
        console.error('Error fetching readouts:', error);
    }
}

export {httpFetchAllReadouts}