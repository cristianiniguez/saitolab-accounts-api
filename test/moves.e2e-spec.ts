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
    const signInResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .auth(testUser1.email, testUser1.password, { type: 'basic' });

    // saving the token
    token = signInResponse.body.access_token;

    // creating an account and saving the id
    const postAccountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send(testAccount1);

    // saving the account id
    accountId = postAccountResponse.body.id;
  });

  describe('(POST) /moves', () => {
    it('should return 201 (Created) and create the move when using a correct body', async () => {
      const postMoveResponse = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId })
        .expect(201);

      expect(postMoveResponse.body).toEqual({
        account: expect.any(Object),
        amount: testMove1.amount,
        date: testMove1.date,
        detail: testMove1.detail,
        id: expect.any(Number),
        type: testMove1.type,
      });
    });

    it('should return 400 (Bad Request) when using a not correct body', async () => {
      const postMoveResponse = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(postMoveResponse.body).toEqual({
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

  describe('(GET|PUT|DELETE) /moves/:id', () => {
    let savedMoveId: string;

    beforeEach(async () => {
      const postMoveResponse = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testMove1, account: accountId });

      savedMoveId = postMoveResponse.body.id;
    });

    it('(GET) should return 200 (OK) and account info when using valid id', async () => {
      const getMoveResponse = await request(app.getHttpServer())
        .get(`/moves/${savedMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getMoveResponse.body).toEqual({
        account: expect.any(Object),
        amount: testMove1.amount,
        date: testMove1.date,
        detail: testMove1.detail,
        id: expect.any(Number),
        type: testMove1.type,
      });
    });

    it('(PUT) should return 200 (OK) and updated account info when using valid id', async () => {
      const putMoveResponse = await request(app.getHttpServer())
        .put(`/moves/${savedMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testMove2)
        .expect(200);

      expect(putMoveResponse.body).toEqual({
        account: expect.any(Object),
        amount: testMove2.amount,
        date: testMove2.date,
        detail: testMove2.detail,
        id: savedMoveId,
        type: testMove2.type,
      });
    });

    it('(DELETE) should return 200 (OK) when using valid id', async () => {
      await request(app.getHttpServer())
        .delete(`/moves/${savedMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('(GET|PUT|DELETE) /moves/:id with invalid move id', () => {
    const testId = 123;

    it('(GET) should return 404 (Not Found) when reading not existing account', async () => {
      const getMoveResponse = await request(app.getHttpServer())
        .get(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(getMoveResponse.body).toEqual({
        error: 'Not Found',
        message: `Move with id ${testId} not found`,
        statusCode: 404,
      });
    });

    it('(PUT) should return 404 (Not Found) when updating not existing account', async () => {
      const putMoveResponse = await request(app.getHttpServer())
        .put(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testMove2)
        .expect(404);

      expect(putMoveResponse.body).toEqual({
        error: 'Not Found',
        message: `Move with id ${testId} not found`,
        statusCode: 404,
      });
    });

    it('(DELETE) should return 404 (Not Found) when deleting not existing account', async () => {
      await request(app.getHttpServer())
        .delete(`/moves/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe("(GET|PUT|DELETE) /moves/:id with other users's move id", () => {
    let otherMoveId: string;

    beforeEach(async () => {
      // creating a second user
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser2);

      // signing in second user
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .auth(testUser2.email, testUser2.password, { type: 'basic' });

      // saving the token of the second user
      const secondToken = signInResponse.body.access_token;

      // creating an account for the second user
      const postAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${secondToken}`)
        .send(testAccount2);

      const accountId = postAccountResponse.body.id;

      // creating a move for the second account
      const postMoveResponse = await request(app.getHttpServer())
        .post('/moves')
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ ...testMove2, account: accountId });

      otherMoveId = postMoveResponse.body.id;
    });

    it("(GET) should return 404 (Not Found) when reading other user's move", async () => {
      await request(app.getHttpServer())
        .get(`/moves/${otherMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it("(PUT) should return 404 (Not Found) when updating other user's move", async () => {
      await request(app.getHttpServer())
        .put(`/moves/${otherMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testMove2)
        .expect(404);
    });

    it("(DELETE) should return 404 (Not Found) when deleting other user's move", async () => {
      await request(app.getHttpServer())
        .delete(`/moves/${otherMoveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
