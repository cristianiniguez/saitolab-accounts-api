# Saito Lab Accounts (API)

API of Saito Lab Accounts (Manage your money in one place easily)

## Description

This API uses:

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/) (with PostgreSQL)

## Installation

Before cloning this repo and start working, install Node and Docker. Use the method you like.

```bash
# clone this repository
$ git clone https://github.com/cristianiniguez/saitolab-accounts-api.git

# install the packages
$ npm install
```

## Env variables and preparing the database

```bash
# copy and past .env.example file to a .env file (then fill the variables)
$ cp .env.example .env

# start postgresql and pgadmin docker containers
$ docker compose -d pgadmin

# run the migrations (this needs to be done only one time at the beginning and every time the entities are modified)
$ npm run migration:run
```

## Running and working on the app

```bash
# start postgresql and pgadmin docker containers (if it is not turned on)
$ docker compose -d pgadmin-dev

# start the development server
$ npm run start:dev

# after working, stop containers
$ docker compose down
```

## Migrations

As we are using TypeORM we need to make migrations after cloning the repo and every time the entities are modified

```bash
# generate the migration
$ npm run migration:generate <use any name>

# run the migration
$ npm run migration:run

# see if the migration has been run
$ npm run migration:show
```

## Test

Unit testing is not available yet. Don't use unit test commands from **_package.json_**.

For e2e testing:

```bash
# start test postgresql container
$ docker compose -f docker-compose.test.yml up -d postgres-test

# copy and past .env.example file to a .env.test file (then fill the variables)
$ cp .env.example .env.test

# run migrations
$ NODE_ENV=test npm run migration:run

# then start the e2e test
$ npm run test:e2e

# after testing
$ docker compose -f docker-compose.test.yml down
```

## Do you want to contribute to this project?

[Contact me](https://www.cristianiniguez.com/#contact)
