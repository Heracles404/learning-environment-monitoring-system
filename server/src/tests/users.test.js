const request = require('supertest');
const app = require('../app');
const User = require('../schema/userSchema');
const argon2 = require('argon2');
const mongoose = require('mongoose');

describe('Users API', () => {
    const user = {
        userName: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        password: 'password123'
    };

    beforeEach(async () => {
        // Clean up the database before each test
        await User.deleteMany({});
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    afterAll(async () => {
        await mongoose.disconnect();  // Disconnect from the database after tests
    });

    it('should create a new user', async () => {
        const response = await request(app).post('/users').send(user);
        expect(response.status).toBe(201);
        expect(response.body.userName).toBe(user.userName);
    });

    it('should get all users', async () => {
        await request(app).post('/users').send(user); // Create user first
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1); // Expecting one user
    });

    it('should get a user by userName', async () => {
        await request(app).post('/users').send(user); // Create user first
        const response = await request(app).get(`/users/${user.userName}`);
        expect(response.status).toBe(200);
        expect(response.body.userName).toBe(user.userName);
    });

    it('should authenticate a user with correct credentials', async () => {
        // Create user and hash the password
        const hashedPassword = await argon2.hash(user.password);
        await new User({ ...user, password: hashedPassword }).save();

        const response = await request(app).post('/users/authenticate').send({
            userName: user.userName,
            password: user.password
        });

        expect(response.status).toBe(200);
        expect(response.body.userName).toBe(user.userName);
    });

    it('should return 401 with invalid credentials', async () => {
        await request(app).post('/users').send(user); // Create user first
        const response = await request(app).post('/users/authenticate').send({
            userName: user.userName,
            password: 'wrongpassword'
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should update a user', async () => {
        await request(app).post('/users').send(user);
        const updatedUser  = { firstName: 'Johnny' };

        const response = await request(app).patch(`/users/${user.userName}`).send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`User ${user.userName} has been updated.`);

        // Verify the update
        const getUserResponse = await request(app).get(`/users/${user.userName}`);
        expect(getUserResponse.body.firstName).toBe('Johnny');
    });

    it('should delete a user by userName', async () => {
        await request(app).post('/users').send(user); // Create user first
        const response = await request(app).delete(`/users/${user.userName}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe(`User ${user.userName} has been deleted.`);

        // Verify deletion
        const getUserResponse = await request(app).get(`/users/${user.userName}`);
        expect(getUserResponse.status).toBe(404);
    });

    it('should return 404 if user is not found', async () => {
        const response = await request(app).get('/users/nonexistent_user');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User nonexistent_user not found...');
    });
});
