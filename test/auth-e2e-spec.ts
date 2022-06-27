import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password',
};

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
  });

  describe('/auth/sign-up (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).delete('/test/users');
    });

    it('should return 201 with correct body', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUser)
        .expect(201);
    });

    it('should return 400 with empty body', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({})
        .expect(400);
    });

    it('should return 400 with repeated email', async () => {
      await request(app.getHttpServer()).post('/auth/sign-up').send(testUser);

      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUser)
        .expect(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
