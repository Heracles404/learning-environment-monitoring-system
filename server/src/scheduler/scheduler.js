const axios = require('axios');
const dayjs = require('dayjs');
const Device = require('../schema/deviceSchema'); // Adjust the path if necessary

// Function to check and update device status
const checkAndUpdateDeviceStatus = async () => {
    try {
        // Retrieve all devices from the database (or use your preferred query method)
        const devices = await Device.find();

        // Get the current time and calculate 5 hours ago
        const fiveHoursAgo = dayjs().subtract(5, 'hours');

        // Loop through the devices
        for (const device of devices) {
            const lastUpdated = dayjs(device.lastUpdated, 'MM/DD/YYYY HH:mm');

            // Check if the device's last update was more than 5 hours ago
            if (lastUpdated.isBefore(fiveHoursAgo)) {
                const classroom = device.classroom;
                console.log(`Updating status to "inactive" for classroom: ${classroom}`);

                // Send a PATCH request to update the device status
                await axios.patch(`http://localhost:8000/devices/classroom/${classroom}`, {
                    status: 'inactive',
                });

                console.log(`Status updated for classroom: ${classroom}`);
            }
        }
    } catch (error) {
        console.error('Error checking/updating device status:', error.message);
    }
};

// Function to start the scheduler to run every 30 seconds
const startDeviceStatusScheduler = () => {
    setInterval(() => {
        console.log('Running device status check...');
        checkAndUpdateDeviceStatus();
    }, 3900000); // 65 MINUTES CHECKING INTERVAL
};

// Export the function to start the scheduler
module.exports = { startDeviceStatusScheduler };
