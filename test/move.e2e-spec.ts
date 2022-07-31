import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { testUser1, testUser2 } from './mocks/users.mock';
import { testAccount1, testAccount2 } from './mocks/accounts.mock';
import { testMove1, testMove2 } from './mocks/moves.mock';

describe('Moves Module (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let accountId: string;

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

    // creating a new user
    await request(app.getHttpServer()).post('/auth/sign-up').send(testUser1);

    // signing in
    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .auth(testUser1.email, testUser1.password, { type: 'basic' });

    // saving the token
    token = response.body.access_token;

    // creating an account and saving the id
    const response2 = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send(testAccount1);
    accountId = response2.body.id;
  });

  describe('(POST) /moves', () => {
    it('should return 201 (Created) and create the move when using a correct body', async () => {
      const response = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId })
        .expect(201);

      expect(response.body).toEqual({
        account: expect.any(Object),
        amount: testMove1.amount,
        date: testMove1.date,
        detail: testMove1.detail,
        id: expect.any(Number),
        type: testMove1.type,
      });
    });

    it('should return 400 (Bad Request) when using a not correct body', async () => {
      const response = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'detail should not be empty',
          'detail must be a string',
          'amount should not be empty',
          'amount must be a positive number',
          'amount must be a number conforming to the specified constraints',
          'date should not be empty',
          'date must be a valid ISO 8601 date string',
          'type should not be empty',
          'type must be one of the following values: income, outcome',
          'type must be a string',
          'account should not be empty',
          'account must be a positive number',
          'account must be an integer number',
        ],
        error: 'Bad Request',
      });
    });
  });

  describe('(GET) /accounts/:id', () => {
    it('should return 200 (OK) and account info when using valid id', async () => {
      const response = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId });

      const id = response.body.id;

      const response2 = await request(app.getHttpServer())
        .get(`/moves/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response2.body).toEqual({
        account: expect.any(Object),
        amount: testMove1.amount,
        date: testMove1.date,
        detail: testMove1.detail,
        id: expect.any(Number),
        type: testMove1.type,
      });
    });

    it('should return 404 (Not Found) when using invalid id', async () => {
      const testId = 123;

      const response = await request(app.getHttpServer())
        .get(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Move with id ${123} not found`,
        statusCode: 404,
      });
    });

    it("should return 404 (Not Found) when using other user's move id", async () => {
      // creating a second user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser2);

      // signing in second user
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser2.email, testUser2.password, { type: 'basic' });

      // saving the token of the second user
      const secondToken = response.body.access_token;

      // creating an account for the second user
      const response2 = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${secondToken}`)
        .send(testAccount2);

      const accountId = response2.body.id;

      // creating a move for the second account
      const response3 = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ ...testMove2, account: accountId });

      const moveId = response3.body.id;

      // reading the account but as the first user
      await request(app.getHttpServer())
        .get(`/moves/${moveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('(PUT) /accounts/:id', () => {
    it('should return 200 (OK) and updated account info when using valid id', async () => {
      const response = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId });

      const id = response.body.id;

      const response2 = await request(app.getHttpServer())
        .put(`/moves/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testMove2)
        .expect(200);

      expect(response2.body).toEqual({
        account: expect.any(Object),
        amount: testMove2.amount,
        date: testMove2.date,
        detail: testMove2.detail,
        id,
        type: testMove2.type,
      });
    });

    it('should return 404 (Not Found) when using invalid id', async () => {
      const testId = 123;

      const response = await request(app.getHttpServer())
        .put(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testMove2)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: `Move with id ${testId} not found`,
        statusCode: 404,
      });
    });

    it("should return 404 (Not Found) when using other user's account id", async () => {
      // creating a second user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser2);

      // signing in second user
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser2.email, testUser2.password, { type: 'basic' });

      // saving the token of the second user
      const secondToken = response.body.access_token;

      // creating an account for the second user
      const response2 = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${secondToken}`)
        .send(testAccount2);

      const accountId = response2.body.id;

      // creating a move for the second account
      const response3 = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ ...testMove2, account: accountId });

      const moveId = response3.body.id;

      // updating the move but as the first user
      await request(app.getHttpServer())
        .put(`/accounts/${moveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount2)
        .expect(404);
    });
  });

  describe('(DELETE) /accounts/:id', () => {
    it('should return 200 (OK) when using valid id', async () => {
      const response = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId });

      const id = response.body.id;

      await request(app.getHttpServer())
        .delete(`/moves/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 (Not Found) when using invalid id', async () => {
      const testId = 123;

      await request(app.getHttpServer())
        .delete(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it("should return 404 (Not Found) when using other user's account id", async () => {
      // creating a second user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser2);

      // signing in second user
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser2.email, testUser2.password, { type: 'basic' });

      // saving the token of the second user
      const secondToken = response.body.access_token;

      // creating an account for the second user
      const response2 = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${secondToken}`)
        .send(testAccount2);

      const accountId = response2.body.id;

      // creating a move for the second account
      const response3 = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ ...testMove2, account: accountId });

      const moveId = response3.body.id;

      // deleting the account but as the first user
      await request(app.getHttpServer())
        .delete(`/moves/${moveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
