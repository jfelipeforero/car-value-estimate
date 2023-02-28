import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', () => {
    const user = {
      email: 'test@test.com',
      password: 'mypassword',
    };
    return request(app.getHttpServer())
      .post('/users/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  it('Signup as a new user then get the currently logged in user', async () => {
    const user = {
      email: 'test@test.com',
      password: 'mypassword',
    };
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(user)
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(202);

    expect(body.email).toEqual(user.email);
  });
});
