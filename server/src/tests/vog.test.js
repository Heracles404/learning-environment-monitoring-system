const request = require('supertest');
const app = require('../app'); // assuming app.js is in the root folder
const mongoose = require('mongoose'); // Make sure mongoose is imported to close the connection

let newReadoutId;

describe('VOG Routes', () => {

    // Test for creating a new readout
    it('should create a new readout', async () => {
        const newReadout = {
            time: "10:00 AM",
            classroom: "Room 101",
            pm25: 12.5,
            pm10: 8.4,
            OAQIndex: 30,
            level: "Low"
        };
        const response = await request(app)
            .post('/vog')
            .send(newReadout);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'New record inserted...');
        expect(response.body.readout).toHaveProperty('date');
        expect(response.body.readout).toHaveProperty('_id'); // Ensure ID is present in the response

        // Store the ID of the new readout for use in subsequent tests
        newReadoutId = response.body.readout._id; // assuming the ID is stored in the response body
    });

    // Test for getting all readouts
    it('should get all readouts', async () => {
        const response = await request(app).get('/vog');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test for getting a specific readout by ID
    it('should get a specific readout by ID', async () => {
        const response = await request(app).get(`/vog/${newReadoutId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pm25');
        expect(response.body).toHaveProperty('pm10');
    });

    // Test for deleting a readout by ID
    it('should delete a readout by ID', async () => {
        const response = await request(app).delete(`/vog/${newReadoutId}`);
        expect(response.status).toBe(201);
    });

    // Test for deleting all readouts
    it('should delete all readouts', async () => {
        const response = await request(app).delete('/vog');
        expect(response.status).toBe(201);
    });

    // Close MongoDB connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
