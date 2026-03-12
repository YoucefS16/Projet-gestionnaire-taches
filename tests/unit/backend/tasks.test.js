const request = require('supertest');
const app = require('../../../backend/server');

async function loginAndGetToken() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password' });

  return response.body.token;
}

describe('Tasks API', () => {
  test('GET /api/tasks returns task list for authenticated user', async () => {
    const token = await loginAndGetToken();

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('POST /api/tasks creates a task with default status todo', async () => {
    const token = await loginAndGetToken();

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nouvelle tâche test',
        description: 'Description test',
        priority: 'high'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Nouvelle tâche test');
    expect(response.body.status).toBe('todo');
    expect(response.body.priority).toBe('high');
  });

  test('POST /api/tasks rejects task without title', async () => {
    const token = await loginAndGetToken();

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Sans titre' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Le titre est requis');
  });

  test('PUT /api/tasks/:id updates task status', async () => {
    const token = await loginAndGetToken();

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tâche à modifier' });

    const response = await request(app)
      .put(`/api/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('done');
  });

  test('DELETE /api/tasks/:id deletes an existing task', async () => {
    const token = await loginAndGetToken();

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tâche à supprimer' });

    const response = await request(app)
      .delete(`/api/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});