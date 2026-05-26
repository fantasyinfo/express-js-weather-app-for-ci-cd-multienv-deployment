# Weather Application Infrastructure Deployment Project

## Project Overview

Designed and deployed a production-style full-stack weather application infrastructure on Microsoft using Linux, Docker, NGINX reverse proxy, custom domains, SSL certificates, and environment-based deployment architecture.

The project demonstrates real-world DevOps practices including:

* cloud infrastructure provisioning
* reverse proxy architecture
* containerized backend deployment
* static frontend hosting
* SSL/TLS security
* DNS management
* environment isolation
* Linux server administration

---

# Project Architecture

```text id="vlsfzy"
Internet
   ↓
fantasyinfo.cloud DNS
   ↓
Azure Static Public IP
   ↓
Azure Ubuntu VM
   ↓
NGINX Reverse Proxy
   ├── Frontend Static Hosting
   └── Backend API Reverse Proxy
            ↓
        Docker Container
            ↓
       Node.js Express API
```

---

# Environment Structure

## Development Environment

### Frontend

```text id="9h13g4"
https://dev.weather.fantasyinfo.cloud
```

### Backend API

```text id="pmjlwm"
https://dev-api.weather.fantasyinfo.cloud
```

---

# Technologies Used

| Category         | Technologies                          |
| ---------------- | ------------------------------------- |
| Cloud Provider   | Microsoft                             |
| Operating System | Ubuntu Linux                          |
| Web Server       | NGINX                                 |
| Containerization | Docker                                |
| Backend          | Node.js + Express.js                  |
| Frontend         | React + Vite                          |
| SSL              | Certbot                               |
| Source Control   | Git + GitHub                          |
| Networking       | Azure VNet + Subnet + NSG             |
| DNS              | Custom domain + Azure DNS integration |

---

# Infrastructure Setup Completed

## Domain & Networking

* Purchased and configured custom domain:

  * `fantasyinfo.cloud`
* Connected domain with Azure DNS services
* Created static public IP for consistent external access
* Configured A records for frontend and backend subdomains
* Created Azure Virtual Network (VNet)
* Configured subnet architecture
* Attached VM to VNet and subnet
* Configured Network Security Group (NSG)

---

# Virtual Machine Configuration

## Linux VM

* Created Ubuntu Linux virtual machine
* Installed system dependencies and updates
* Configured SSH access
* Installed Git
* Installed Node.js and npm
* Installed Docker Engine
* Installed NGINX web server

---

# Backend Deployment

## Node.js Express API

* Cloned project repository from GitHub
* Pulled development branch
* Built Docker image for backend API
* Exposed:

  * Host Port: `3200`
  * Container Port: `3000`
* Configured Docker runtime
* Verified API health endpoints
* Successfully deployed API using Docker containerization

---

# Frontend Deployment

## React + Vite

* Generated optimized production build using:

  ```bash id="0jlwmv"
  npm run build
  ```
* Copied production build (`dist/`) to:

  ```text id="jlwmj3"
  /var/www/dev-weather
  ```
* Configured NGINX static hosting
* Enabled SPA routing using:

  ```nginx id="1jlwmr"
  try_files $uri /index.html;
  ```

---

# Reverse Proxy Configuration

## NGINX Virtual Hosts

Configured separate server blocks for:

| Service     | Domain                              |
| ----------- | ----------------------------------- |
| Frontend    | `dev.weather.fantasyinfo.cloud`     |
| Backend API | `dev-api.weather.fantasyinfo.cloud` |

Implemented:

* reverse proxy routing
* host-based routing
* proxy headers
* static frontend serving
* API forwarding

---

# SSL & Security

## HTTPS Configuration

* Installed Certbot
* Generated SSL certificates using Let's Encrypt
* Enabled HTTPS for:

  * frontend domain
  * backend API domain
* Configured automatic HTTP → HTTPS redirection

---

# Deployment Validation

Successfully verified:

* frontend accessibility
* backend API accessibility
* SSL certificate functionality
* reverse proxy routing
* Docker container health
* domain resolution
* HTTPS communication

---

# Key DevOps Concepts Demonstrated

* Cloud Infrastructure Deployment
* Linux System Administration
* Docker Containerization
* Reverse Proxy Architecture
* SSL/TLS Configuration
* DNS Management
* Network Security
* Environment-Based Deployment
* Static Frontend Hosting
* Backend API Deployment
* Production-Style Infrastructure Design

---

# Future Enhancements

Planned next-phase improvements:

* CI/CD using GitHub Actions
* Development / QA / Production pipelines
* Docker Compose orchestration
* Monitoring with Grafana & Prometheus
* Infrastructure as Code (Terraform)
* Kubernetes deployment
* Centralized logging
* Automated deployment workflows

---

# Outcome

Successfully built and deployed a production-style cloud-hosted application infrastructure demonstrating practical DevOps, cloud engineering, Linux administration, networking, and deployment automation fundamentals.
