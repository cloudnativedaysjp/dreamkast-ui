# Dreamkast UI

This is a front-end application for online conferences. 

## How to run locally 

```
npm run dev
```

## How to use it?

Build docker container

```
docker build -t <IMAGE> .
```

Then run the container

```
docker run -p 3001:3001 --name dremakst-ui <IMAGE>
```

## How to run entire system

You can run all components including Dreamkast, LB, UI and other dependency with docker-compose.

1. Create .env.local file and fill required values

```
export AUTH0_CLIENT_ID=
export AUTH0_CLIENT_SECRET=
export AUTH0_DOMAIN=
export SENTRY_DSN=
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export S3_BUCKET=
export S3_REGION=
export MYSQL_HOST=db
export MYSQL_USER=user
export MYSQL_PASSWORD=password
export MYSQL_DATABASE=dreamkast
export REDIS_URL=redis://redis:6379
export RAILS_MASTER_KEY=
```

2. Configure awscli and logged in registry 

```
source .env-local
aws ecr get-login-password | docker login --username AWS --password-stdin http://607167088920.dkr.ecr.ap-northeast-1.amazonaws.com/
```

3. Run

```
docker-compose up -d
```

You can access dreamkast and dreamkast-ui `http://localhost:8080/`

## License

MIT License 
