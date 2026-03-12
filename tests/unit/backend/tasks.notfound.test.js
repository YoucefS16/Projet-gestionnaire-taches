const request = require('supertest');
const app = require('../../../backend/server');

async function loginAndGetToken() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password' });

  return response.body.token;
}

describe('Tasks API - not found cases', () => {
  test('PUT /api/tasks/:id returns 404 for unknown task id', async () => {
    const token = await loginAndGetToken();

    const response = await request(app)
      .put('/api/tasks/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('DELETE /api/tasks/:id returns 404 for unknown task id', async () => {
    const token = await loginAndGetToken();

    const response = await request(app)
      .delete('/api/tasks/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});