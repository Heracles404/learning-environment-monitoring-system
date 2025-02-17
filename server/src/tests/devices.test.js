const request = require('supertest');
const app = require('../app');
const Device = require('../schema/deviceSchema');
const mongoose = require('mongoose');

describe('Devices API', () => {
    const device = {
        classroom: 'ROOM 101',
        status: 'active',
        bh1750: 'active',
        bme680: 'active',
        pms5003: 'active',
        lastUpdated: '2025-02-17 10:00'
    };

    beforeEach(async () => {
        // Clean up the database before each test
        await Device.deleteMany({});
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    afterAll(async () => {
        await mongoose.disconnect();  // Disconnect from the database after tests
    });

    it('should create a new device', async () => {
        const response = await request(app).post('/devices').send(device);
        // console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.readout.classroom).toBe(device.classroom);
    });

    it('should get all devices', async () => {
        await request(app).post('/devices').send(device); // Create device first
        const response = await request(app).get('/devices');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1); // Expecting one device
    });

    it('should get a device by ID', async () => {
        const newDevice = await request(app).post('/devices').send(device);
        const deviceId = newDevice.body.readout._id;
        const response = await request(app).get(`/devices/${deviceId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(deviceId);
    });

    it('should get devices by classroom', async () => {
        await request(app).post('/devices').send(device); // Create device first
        const response = await request(app).get(`/devices/classroom/${device.classroom}`);
        expect(response.status).toBe(200);
        expect(response.body[0].classroom).toBe(device.classroom);
    });

    it('should return 404 when device is not found by ID', async () => {
        const response = await request(app).get('/devices/605c72ef1532071a50c5c5e7'); // Invalid ID
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Device not found');
    });

    it('should update a device by ID', async () => {
        const newDevice = await request(app).post('/devices').send(device);
        const deviceId = newDevice.body.readout._id;
        const updatedDevice = { status: 'ACTIVE' };

        const response = await request(app).patch(`/devices/${deviceId}`).send(updatedDevice);
        expect(response.status).toBe(200);
        expect(response.body.device.status).toBe(updatedDevice.status);

        // Verify the update
        const getDeviceResponse = await request(app).get(`/devices/${deviceId}`);
        expect(getDeviceResponse.body.status).toBe(updatedDevice.status);
    });

    it('should delete a device by ID', async () => {
        const newDevice = await request(app).post('/devices').send(device); // Create device first
        const deviceId = newDevice.body.readout._id;
        const response = await request(app).delete(`/devices/${deviceId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deleted successfully.');

        // Verify deletion
        const getDeviceResponse = await request(app).get(`/devices/${deviceId}`);
        expect(getDeviceResponse.status).toBe(404);
    });

    it('should return 404 if device is not found by classroom', async () => {
        const response = await request(app).get('/devices/classroom/nonexistent_classroom');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No devices found in classroom nonexistent_classroom');
    });

    it('should get active devices count', async () => {
        await request(app).post('/devices').send(device); // Create device first
        const response = await request(app).get('/devices/getActive');
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(1);
    });

    it('should get inactive devices count', async () => {
        const inactiveDevice = { ...device, status: 'inactive' };
        await request(app).post('/devices').send(inactiveDevice);
        const response = await request(app).get('/devices/getInactive');
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(1);
    });
});
