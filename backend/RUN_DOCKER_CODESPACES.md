# Run With Single Dockerfile + Kafka Compose

## Start Kafka
```bash
docker compose up -d
```

This starts:
- Kafka on `9092`
- Kafka UI on `8085`

## Build each service using the same Dockerfile
```bash
docker build -f Dockerfile --build-arg SERVICE_PATH=AuthService -t auth-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Student-Service -t student-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Tpo-Service -t tpo-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Notification-Service -t notification-service:latest .
```

## Run each service container
```bash
docker run -d --name auth-service -p 8083:8083 -e SERVER_PORT=8083 auth-service:latest
docker run -d --name student-service -p 8081:8081 -e SERVER_PORT=8081 -e KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 student-service:latest
docker run -d --name tpo-service -p 8080:8080 -e SERVER_PORT=8080 -e KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 tpo-service:latest
docker run -d --name notification-service -p 8082:8082 -e SERVER_PORT=8082 -e KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 notification-service:latest
```

If needed, also pass your DB and mail env vars in `docker run`.

## Stop Kafka
```bash
docker compose down
```
