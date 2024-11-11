import request from 'supertest';
import app from '../app.js';  // Assuming you have an Express app
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

// Mocking Employee model
jest.mock('../models/Employee.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Test Suite for authController
describe('POST /login', () => {

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a token on successful login', async () => {
    const employeeData = { _id: '123', name: 'John', password: 'hashedpassword', role: 'admin' };
    
    // Mock the Employee.findOne method to return an employee
    Employee.findOne.mockResolvedValue(employeeData);
    
    // Mock bcrypt.compare to return true (password matches)
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock jwt.sign to return a fake token
    jwt.sign.mockReturnValue('fake-jwt-token');
    
    const response = await request(app)
      .post('/login')
      .send({ name: 'John', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBe('fake-jwt-token');
    expect(jwt.sign).toHaveBeenCalledWith({ id: employeeData._id, role: employeeData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should return 401 if employee does not exist', async () => {
    // Mock the Employee.findOne method to return null (no employee found)
    Employee.findOne.mockResolvedValue(null);
    
    const response = await request(app)
      .post('/login')
      .send({ name: 'John', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication failed');
  });

  it('should return 401 if password is incorrect', async () => {
    const employeeData = { _id: '123', name: 'John', password: 'hashedpassword', role: 'admin' };
    
    // Mock the Employee.findOne method to return an employee
    Employee.findOne.mockResolvedValue(employeeData);
    
    // Mock bcrypt.compare to return false (incorrect password)
    bcrypt.compare.mockResolvedValue(false);
    
    const response = await request(app)
      .post('/login')
      .send({ name: 'John', password: 'incorrectpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication failed');
  });

  it('should return 500 if an error occurs', async () => {
    // Mock Employee.findOne to throw an error
    Employee.findOne.mockRejectedValue(new Error('Database error'));
    
    const response = await request(app)
      .post('/login')
      .send({ name: 'John', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error logging in');
  });
});
