import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { testUser1 as testUser } from './mocks/users.mock';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    );

    await app.init();

    // deleting all data
    await request(app.getHttpServer()).delete('/test');
  });

  describe('/auth/sign-up (POST)', () => {
    it('should return 201 (Created) when using a correct body', async () => {
      const signUpResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUser)
        .expect(201);

      const { email, firstName, lastName } = testUser;

      expect(signUpResponse.body).toEqual({
        email,
        firstName,
        lastName,
        role: 'client',
        id: expect.any(Number),
      });
    });

    it('should return 400 (Bad Request) when using an empty body', async () => {
      const signUpResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({})
        .expect(400);

      expect(signUpResponse.body).toEqual({
        statusCode: 400,
        message: [
          'email should not be empty',
          'email must be an email',
          'password should not be empty',
          'password must be a string',
          'firstName should not be empty',
          'firstName must be a string',
          'lastName should not be empty',
          'lastName must be a string',
        ],
        error: 'Bad Request',
      });
    });

    it('should return 400 (Bad Request) when using a repeated email', async () => {
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser);

      const signUpResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUser)
        .expect(400);

      expect(signUpResponse.body).toEqual({
        statusCode: 400,
        message: 'Email is already in use',
        error: 'Bad Request',
      });
    });
  });

  describe('/auth/sign-in (POST)', () => {
    beforeEach(async () => {
      // creating a new user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser);
    });

    it('should return 201 (Created) when using valid credentials', async () => {
      const { email, firstName, lastName, password } = testUser;

      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(email, password, { type: 'basic' })
        .expect(201);

      expect(signInResponse.body).toEqual({
        access_token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: email,
          firstName,
          lastName,
          role: 'client',
        },
      });
    });

    it('should return 401 (Unauthorized) when using invalid email', async () => {
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth('someone', testUser.password, { type: 'basic' })
        .expect(401);

      expect(signInResponse.body).toEqual({
        statusCode: 401,
        message: 'Not allowed - Wrong credentials',
        error: 'Unauthorized',
      });
    });

    it('should return 401 (Unauthorized) when using invalid password', async () => {
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser.email, 'else', { type: 'basic' })
        .expect(401);

      expect(signInResponse.body).toEqual({
        statusCode: 401,
        message: 'Not allowed - Wrong credentials',
        error: 'Unauthorized',
      });
    });
  });

  describe('/auth/check (GET)', () => {
    let token: string;

    beforeEach(async () => {
      // creating a new user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser);

      // signing in
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser.email, testUser.password, { type: 'basic' });

      // saving the token
      token = signInResponse.body.access_token;
    });

    it('should return 200 (OK) when sending a correct token', async () => {
      const checkResponse = await request(app.getHttpServer())
        .get('/auth/check')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const { email, firstName, lastName } = testUser;

      expect(checkResponse.body).toEqual({
        id: expect.any(Number),
        email,
        firstName,
        lastName,
        role: 'client',
      });
    });

    it('should return 401 (Unauthorized) when sending an incorrect token', async () => {
      const checkResponse = await request(app.getHttpServer())
        .get('/auth/check')
        .set('Authorization', `Bearer 12346789`)
        .expect(401);

      expect(checkResponse.body).toEqual({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
