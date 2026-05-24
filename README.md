# Price Observer

Backend-focused monitoring platform built with Laravel, Redis, Horizon, Prometheus and Grafana.

Originally created as a simple price monitoring study project, it gradually evolved into a playground for exploring:

- asynchronous processing
- observability
- runtime metrics
- caching strategies
- queue orchestration
- monitoring stacks
- Dockerized infrastructure

The current focus of the project is backend architecture and observability rather than production-grade scraping.

---

# Current Status

The application is currently capable of:

- managing monitored products
- tracking mock price histories
- processing asynchronous jobs through queues
- exposing runtime metrics to Prometheus
- monitoring queues through Laravel Horizon
- visualizing operational metrics through Grafana
- collecting cache telemetry and request metrics

At the moment, the scraping layer itself is intentionally mocked and no real scraping is performed yet.

---

# Features

## Product Management

- Product CRUD
- Product monitoring status
- Historical mock price tracking

## Queue System

- Redis-backed queues
- Laravel Horizon integration
- Queue monitoring
- Failed job tracking
- Scheduled monitoring jobs

## Cache Layer

- Redis cache
- Cache metrics
- Hit/miss tracking
- Cache observability dashboard
- Key inspection and TTL monitoring

## Observability

- Runtime request metrics
- Request duration tracking
- Slow request monitoring
- System health checks
- Queue metrics
- Cache metrics
- Prometheus exporter endpoint
- Grafana integration

## Infrastructure

- Dockerized environment
- Redis
- PostgreSQL
- Horizon worker container
- Prometheus container
- Grafana container

---

# Tech Stack

## Backend

- Laravel
- PHP 8.3
- Redis
- PostgreSQL

## Frontend

- Vue.js
- Inertia.js
- TailwindCSS

## Observability

- Laravel Horizon
- Prometheus
- Grafana

## Infrastructure

- Docker
- Docker Compose

---

# Architecture Overview

The application currently follows a backend-oriented architecture with emphasis on observability and asynchronous processing.

Laravel Application

│

├── Redis Cache Layer

├── Queue Workers (Horizon)

├── Request Metrics Middleware

├── Cache Metrics Service

├── Prometheus Exporter

└── Scheduled Monitoring Jobs


# Metrics and Monitoring

The application exposes custom metrics through Prometheus, including:

total requests
average response time
slow requests
cache hit rate
queue metrics
failed jobs
monitored products
price history events

Prometheus scrapes the application metrics endpoint periodically and Grafana is used for visualization.

# Running Locally

## Requirements

- Docker
- Docker Compose

# Setup

git clone https://github.com/igorgd94/Price-Observer.git

cd Price-Observer

docker compose up -d

docker compose exec app composer install

docker compose exec app npm install

docker compose exec app php artisan migrate

docker compose exec app npm run dev

# Services


Application	http://localhost:8080/dashboard

Horizon	http://localhost:8080/horizon

Prometheus	http://localhost:9090

Grafana	http://localhost:3000


# Project Goals

This project was created primarily as a learning platform for exploring:

Laravel queues
Redis caching
observability concepts
runtime telemetry
Prometheus integration
Grafana dashboards
backend monitoring
asynchronous architectures

The main goal is not building a production-ready scraping platform, but rather studying the infrastructure and architectural concerns around these systems.

# Current Limitations

Scraping is currently fully mocked
No real external data collection yet
No notification pipeline implemented
No alerting system yet
Grafana dashboards are still being refined

# Roadmap

## Observability

 O Runtime metrics
 
 O Redis cache metrics
 
 O Horizon integration
 
 O Prometheus exporter
 
 O Advanced Grafana dashboards
 
 X Alert system
 
 X Centralized logging
 
## Monitoring

 O Scheduled jobs
 
 O Queue processing
 
 X Real scraping implementation
 
 X Multi-source monitoring
 
 X Notification pipeline
 
 X Price alerts
 
## Infrastructure

 O Dockerized environment
 
 O Dedicated Horizon container
 
 O Prometheus container
 
 O Grafana container
 
 X Redis exporter
 
 X PostgreSQL exporter
 

 # Screenshots

 <img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/f56151dd-f1e7-4987-88e2-41a46823ff57" />
 <img width="1913" height="919" alt="image" src="https://github.com/user-attachments/assets/5db034e7-33ec-4706-977f-d3dc134535e1" />
 <img width="1914" height="923" alt="image" src="https://github.com/user-attachments/assets/d3134107-a263-4ba1-a07d-812c2f127f14" />


<img width="1914" height="921" alt="image" src="https://github.com/user-attachments/assets/57c12499-f625-4057-9734-38dee268e946" />
<img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/2cddc959-6a3c-4b45-abbb-f299ad4c9158" />
<img width="1915" height="916" alt="image" src="https://github.com/user-attachments/assets/460104e3-e24e-4f9a-b943-adfdb29a96d1" />


 # License

 This project is intended for educational and study purposes.
