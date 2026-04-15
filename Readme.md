# Campus Placement Management System

A full-stack campus placement platform for students and Training & Placement Office (TPO) teams.

This project combines a React frontend with Spring Boot microservices for authentication, student profiles, job postings, applications, sessions, and notifications. Kafka is used for event-driven notifications, and MySQL is used for persistent storage.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Spring Boot, Spring Security, Spring Data JPA, OpenFeign
- Database: MySQL
- Messaging: Apache Kafka
- Notifications: Spring Mail
- Containerization: Docker, Docker Compose

## Services

### Frontend

User-facing web app for:

- student login/signup and profile management
- browsing jobs and applying
- viewing applied jobs
- viewing upcoming sessions
- TPO job creation and job management
- TPO session creation and session management

### Auth Service

Handles:

- authentication
- student and TPO account operations
- JWT-based access flow
- mail-backed auth-related workflows

Default port: `8084`

### Student Service

Handles:

- student profile data
- academics
- special criteria
- applied jobs
- student-side job listing
- offers

Default port: `8081`

### TPO Service

Handles:

- job descriptions
- applications and status updates
- offers
- sessions

Default port: `8083` externally, service runs on `8080` inside container

### Notification Service

Consumes Kafka events and sends notifications for actions like job postings.

Default port: `8082`

## Main Features

- Role-based flow for students and TPO users
- Student profile management with academics and resume upload
- TPO job creation and update flow
- Student job application tracking
- TPO session scheduling
- Applied student listing for TPO
- Kafka-driven notification pipeline

## Frontend Routes

### Student

- `/student/company-list`
- `/student/company-list/job-description/:id`
- `/student/applied-list`
- `/student/upcoming-session`
- `/student/profile`

### TPO

- `/tpo/create-job`
- `/tpo/view-jobs`
- `/tpo/view-jobs/job/:id`
- `/tpo/view-jobs/job/:id/applied-students`
- `/tpo/create-session`

## Environment Variables

The repository includes `.env.example`.

Important values used by the project include:

- `JWT_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM`
- `MYSQL_ROOT_PASSWORD`

Create a local `.env` file from `.env.example` and replace placeholder or personal values before running in a shared environment.

## Running With Docker Compose

This is the easiest way to start the backend stack.

### 1. Start containers

```bash
docker compose up --build
```

This starts:

- MySQL on `3307`
- Kafka on `9092`
- Kafka UI on `8085`
- Student Service on `8081`
- Notification Service on `8082`
- TPO Service on `8083`
- Auth Service on `8084`

### 2. Open supporting tools

- Kafka UI: `http://localhost:8085`

### 3. Stop containers

```bash
docker compose down
```

To also remove volumes:

```bash
docker compose down -v
```

## Running Frontend Locally

From the `Frontend` folder:

```bash
npm install
npm run dev
```

Vite will start the frontend locally, usually on `http://localhost:5173`.

## Backend Build Strategy

The repository uses a shared root `Dockerfile` for the Spring Boot services:

```bash
docker build -f Dockerfile --build-arg SERVICE_PATH=AuthService -t auth-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Student-Service -t student-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Tpo-Service -t tpo-service:latest .
docker build -f Dockerfile --build-arg SERVICE_PATH=Notification-Service -t notification-service:latest .
```

## Development Notes

- Frontend API base URLs are read from Vite environment variables with localhost fallbacks.
- Student and TPO services communicate with each other using HTTP clients.
- Notification delivery is event-driven through Kafka topics.
- MySQL databases are created automatically through the configured datasource URLs in Docker.

## Default Ports

| Service | Port |
|---|---|
| Frontend (Vite) | `5173` |
| Student Service | `8081` |
| Notification Service | `8082` |
| TPO Service | `8083` |
| Auth Service | `8084` |
| Kafka | `9092` |
| Kafka UI | `8085` |
| MySQL | `3307` |

