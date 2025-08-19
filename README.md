# Loop 2.0

Loop 2.0 is a modern, full-stack educational platform designed to deliver interactive coding lessons, manage user authentication, and provide a scalable sandbox environment for AI and Python code execution. The project is built with a microservices architecture using Docker, Kubernetes, and GitHub Actions for CI/CD.

---

## Features

- **Frontend**: React (Next.js), Material UI, TypeScript, multi-language support.
- **Backend**: Django REST API, PostgreSQL, Redis.
- **Broker**: Manages job distribution and sandbox orchestration.
- **Sandboxes**: Isolated environments for running Python and AI code.
- **Authentication**: Social login (GitHub, Google, Facebook) and email/password.
- **CI/CD**: Automated linting, testing, building, and deployment using GitHub Actions.
- **Dockerized**: All services are containerized for easy local development and cloud deployment.
- **Kubernetes**: Production deployments use Kubernetes for scalability and reliability.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/loop-2.0.git
   cd loop-2.0
   ```

2. **Copy environment files**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp sandbox/python/.env.example sandbox/python/.env
   cp sandbox/ai/.env.example sandbox/ai/.env
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Frontend**
   - Runs on [http://localhost:3000](http://localhost:3000)

5. **Backend**
   - Runs on [http://localhost:8000](http://localhost:8000)

---

## Project Structure

```
loop-2.0/
├── backend/           # Django REST API
├── broker/            # Job broker service
├── frontend/          # Next.js React frontend
├── sandbox/
│   ├── python/        # Python sandbox service
│   └── ai/            # AI sandbox service
├── nginx/             # Nginx reverse proxy
├── .github/
│   └── workflows/     # CI/CD workflows
├── docker-compose.yml
├── README.md
└── ...
```

---

## CI/CD

- **Linting & Testing**: Automated via GitHub Actions on every PR and push.
- **Build & Deploy**: Docker images are built and pushed to Docker Hub. Kubernetes manifests are used for deployment.
- **Manual Approval**: Production deployments require manual approval in GitHub Actions.

---

## Environment Variables

Each service has its own `.env` file. See `.env.example` files for required variables.

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests.
3. Submit a pull request.

---

## License

MIT License

---

## Contact

For questions or support, open an issue or contact the maintainers.

---
