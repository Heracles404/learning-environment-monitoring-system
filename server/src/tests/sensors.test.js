const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const Sensors = require('../models/sensors.model'); // Ensure correct import path

let mongoServer;

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
        const sensor = new Sensors({
            classroom: '102',
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

        await sensor.save(); // Save the sensor before using it

        const res = await request(app)
            .get(`/sensors/${sensor._id}`)
            .expect(200);

        expect(res.body.classroom).toBe(sensor.classroom);
        expect(res.body.date).toBe(sensor.date);
    });

    // Test GET /sensors/classroom/:classroom to fetch readouts by classroom
    it('should return readouts by classroom', async () => {
        const classroom = '102';
        const sensor1 = new Sensors({
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
        await sensor1.save();

        const sensor2 = new Sensors({
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
        await sensor2.save();

        const res = await request(app)
            .get(`/sensors/classroom/${classroom}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].classroom).toBe(classroom);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // // Test GET /sensors/date/date to fetch readouts by date range
    // it('should return readouts by date range', async () => {
    //     const startDate = '2025-02-01';
    //     const endDate = '2025-02-17';
    //     const sensor = new Sensors({
    //         classroom: '103',
    //         date: '2025-02-17',
    //         time: '03:00 PM',
    //         temperature: 24,
    //         humidity: 58,
    //         heatIndex: 27,
    //         lighting: 450,
    //         voc: 0.6,
    //         IAQIndex: 55,
    //         indoorAir: 'Good',
    //         temp: 'Normal',
    //         lightRemarks: 'Optimal'
    //     });
    //     await sensor.save();
    //
    //     const res = await request(app)
    //         .get(`/sensors/date/date?startDate=${startDate}&endDate=${endDate}`)
    //         .expect(200);
    //
    //     expect(Array.isArray(res.body)).toBeTruthy();
    // });

    // // Test GET /sensors/time/:time to fetch readouts by time
    // it('should return readouts by time', async () => {
    //     const time = '12:00 PM';
    //     const sensor = new Sensors({
    //         classroom: '104',
    //         date: '2025-02-17',
    //         time: time,
    //         temperature: 22,
    //         humidity: 55,
    //         heatIndex: 26,
    //         lighting: 400,
    //         voc: 0.4,
    //         IAQIndex: 48,
    //         indoorAir: 'Normal',
    //         temp: 'Normal',
    //         lightRemarks: 'Optimal'
    //     });
    //     await sensor.save();
    //
    //     const res = await request(app)
    //         .get(`/sensors/time/${time}`)
    //         .expect(200);
    //
    //     expect(Array.isArray(res.body)).toBeTruthy();
    //     expect(res.body[0].time).toBe(time);
    // });

    // Test DELETE /sensors/:id to delete a specific readout by ID
    it('should delete a readout by ID', async () => {
        const sensor = new Sensors({
            classroom: '105',
            date: '2025-02-17',
            time: '04:00 PM',
            temperature: 26,
            humidity: 60,
            heatIndex: 28,
            lighting: 470,
            voc: 0.7,
            IAQIndex: 58,
            indoorAir: 'Good',
            temp: 'Normal',
            lightRemarks: 'Optimal'
        });
        await sensor.save();

        const res = await request(app)
            .delete(`/sensors/${sensor._id}`)
            .expect(201);

        expect(res.body).toBe('Deleted');
    });

    // Test DELETE /sensors to delete all readouts
    it('should delete all readouts', async () => {
        const res = await request(app)
            .delete('/sensors')
            .expect(204);

        expect(res.body.message).toBeUndefined();
    });
});
