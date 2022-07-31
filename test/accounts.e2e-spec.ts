import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { testUser1, testUser2 } from './mocks/users.mock';
import { testAccount1, testAccount2 } from './mocks/accounts.mock';

describe('Accounts Module (e2e)', () => {
  let app: INestApplication;
  let token: string;

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
  });

  describe('(POST) /accounts', () => {
    it('should return 201 (Created) and create the account when using a correct body', async () => {
      const postAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount1)
        .expect(201);

      expect(postAccountResponse.body).toEqual({
        name: testAccount1.name,
        user: expect.any(Object),
        id: expect.any(Number),
      });
    });

    it('should return 400 (Bad Request) when using a not correct body', async () => {
      const postAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(postAccountResponse.body).toEqual({
        statusCode: 400,
        message: ['name should not be empty', 'name must be a string'],
        error: 'Bad Request',
      });
    });
  });

  describe('(GET) /accounts', () => {
    it('should return 200 (OK) and user accounts', async () => {
      const postAccountResponse1 = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount1);

      const postAccountResponse2 = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount2);

      const getAccountsResponse = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getAccountsResponse.body).toHaveLength(2);
      expect(getAccountsResponse.body).toContainEqual({
        id: postAccountResponse1.body.id,
        name: testAccount1.name,
      });
      expect(getAccountsResponse.body).toContainEqual({
        id: postAccountResponse2.body.id,
        name: testAccount2.name,
      });
    });
  });

  describe('(GET|PUT|DELETE) /accounts/:id', () => {
    let savedAccountId: string;

    beforeEach(async () => {
      const postAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount1);

      savedAccountId = postAccountResponse.body.id;
    });

    it('(GET) should return 200 (OK) and account info when using valid id', async () => {
      const getAccountResponse = await request(app.getHttpServer())
        .get(`/accounts/${savedAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getAccountResponse.body).toEqual({
        id: savedAccountId,
        moves: [],
        name: testAccount1.name,
      });
    });

    it('(PUT) should return 200 (OK) and updated account info when using valid id', async () => {
      const putAccountResponse = await request(app.getHttpServer())
        .put(`/accounts/${savedAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount2)
        .expect(200);

      expect(putAccountResponse.body).toEqual({
        id: savedAccountId,
        moves: [],
        name: testAccount2.name,
      });
    });

    it('(DELETE) should return 200 (OK) when using valid id', async () => {
      await request(app.getHttpServer())
        .delete(`/accounts/${savedAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('(GET|PUT|DELETE) /accounts/:id with invalid account id', () => {
    const testId = 123;

    it('(GET) should return 404 (Not Found) when reading not existing account', async () => {
      const getAccountResponse = await request(app.getHttpServer())
        .get(`/accounts/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(getAccountResponse.body).toEqual({
        error: 'Not Found',
        message: `Account with id ${testId} not found`,
        statusCode: 404,
      });
    });

    it('(PUT) should return 404 (Not Found) when updating not existing account', async () => {
      const putAccountResponse = await request(app.getHttpServer())
        .put(`/accounts/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount2)
        .expect(404);

      expect(putAccountResponse.body).toEqual({
        error: 'Not Found',
        message: `Account with id ${testId} not found`,
        statusCode: 404,
      });
    });

    it('(DELETE) should return 404 (Not Found) when deleting not existing account', async () => {
      await request(app.getHttpServer())
        .delete(`/accounts/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe("(GET|PUT|DELETE) /accounts/:id with other users's account id", () => {
    let otherAccountId: string;

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

      otherAccountId = postAccountResponse.body.id;
    });

    it("(GET) should return 404 (Not Found) when reading other user's account", async () => {
      await request(app.getHttpServer())
        .get(`/accounts/${otherAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it("(PUT) should return 404 (Not Found) when updating other user's account", async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${otherAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testAccount2)
        .expect(404);
    });

    it("(DELETE) should return 404 (Not Found) when deleting other user's account", async () => {
      await request(app.getHttpServer())
        .delete(`/accounts/${otherAccountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
