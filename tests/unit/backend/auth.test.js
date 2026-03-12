const request = require('supertest');
const app = require('../../../backend/server');

describe('Auth API', () => {
  test('POST /api/auth/login returns token with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('admin@test.com');
  });

  test('POST /api/auth/login rejects invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrong-password' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Identifiants invalides');
  });

  test('GET /api/tasks rejects request without token', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Token d'accès requis");
  });
});