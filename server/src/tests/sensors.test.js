const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const {newReadouts} = require('../models/sensors.model'); // Ensure correct import path

let mongoServer;
let newReadoutId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri(); // This is the in-memory URI

    // Only connect once to the database
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

afterAll(async () => {
    // Drop the database and close the connection after tests are done
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Sensors API', () => {

    // Test POST /sensors to create new readout
    it('should create a new readout', async () => {
        const newReadout = {
            classroom: '101',
            date: '2025-02-17',
            time: '12:00 PM',
            temperature: 25,
            humidity: 60,
            heatIndex: 28,
            lighting: 500,
            voc: 0.5,
            IAQIndex: 50,
            indoorAir: 'Good',
            temp: 'Normal',
            lightRemarks: 'Optimal'
        };

        const res = await request(app)
            .post('/sensors')
            .send(newReadout)
            .expect(201);

        expect(res.body.message).toBe('New record inserted...');
        expect(res.body.readout.classroom).toBe(newReadout.classroom);
        expect(res.body.readout._id).toBeDefined();  // Check if _id is included

        // Store the _id for future queries
        newReadoutId = res.body.readout._id;
    });

    // Test GET /sensors to fetch all readouts
    it('should return all readouts', async () => {
        const res = await request(app)
            .get('/sensors')
            .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test GET /sensors/:id to fetch a specific readout by ID
    it('should return a readout by ID', async () => {
        const res = await request(app)
            .get(`/sensors/${newReadoutId}`)
            .expect(200);

        expect(res.body._id).toBe(newReadoutId); // Check that the returned ID matches
        expect(res.body.classroom).toBe('101');
    });

    it('should return readouts by classroom', async () => {
        const classroom = '102';

        // Use the newReadouts function from your model to save the readout
        const sensor1 = await newReadouts({
            classroom: classroom,
            date: '2025-02-17',
            time: '02:00 PM',
            temperature: 22,
            humidity: 55,
            heatIndex: 26,
            lighting: 400,
            voc: 0.4,
            IAQIndex: 48,
            indoorAir: 'Normal',
            temp: 'Normal',
            lightRemarks: 'Optimal'
        });

        const sensor2 = await newReadouts({
            classroom: classroom,
            date: '2025-02-17',
            time: '03:00 PM',
            temperature: 23,
            humidity: 56,
            heatIndex: 27,
            lighting: 450,
            voc: 0.45,
            IAQIndex: 49,
            indoorAir: 'Good',
            temp: 'Normal',
            lightRemarks: 'Optimal'
        });

        const res = await request(app)
            .get(`/sensors/classroom/${classroom}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].classroom).toBe(classroom);
        expect(res.body.length).toBeGreaterThan(0);
    });


    // Test DELETE /sensors/:id to delete a specific readout by ID
    it('should delete a readout by ID', async () => {
        const res = await request(app)
            .delete(`/sensors/${newReadoutId}`)
            .expect(200);

        expect(res.body.message).toBe('Deleted'); // Assuming the response message for delete is 'Deleted'

        // Verify deletion
        const deletedRes = await request(app)
            .get(`/sensors/${newReadoutId}`)
            .expect(404); // Verify it returns a 404 after deletion
    });

    // Test DELETE /sensors to delete all readouts
    it('should delete all readouts', async () => {
        const res = await request(app)
            .delete('/sensors')
            .expect(204);

        expect(res.body.message).toBeUndefined(); // Expecting no response body
    });
});
