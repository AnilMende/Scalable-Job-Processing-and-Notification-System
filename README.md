
### 🚀 Job Processing System (Distributed Queue + Real-Time Dashboard)

A production-ready Job Processing System built to handle asynchronous tasks efficiently using a distributed architecture. 
This system decouples request handling from heavy background processing, ensuring scalability, reliability, and fault tolerance—just like real-world systems used in large-scale applications.

---

### Overview

This system allows users to create background jobs which are processed asynchronously using a distributed worker setup. 
The application provides live job tracking, queue visibility, and system metrics through a real-time dashboard.

---

### 🌐 Live Demo

* Frontend: https://your-frontend.vercel.app
* Backend API: https://your-backend.onrender.com

---

### System Architecture:

Client (Frontend - Vercel)
        ↓
Backend API (Render - Express)
        ↓
Redis Queue (Upstash)
        ↓
Worker Service (Railway)
        ↓
MongoDB (Database)
        ↓
Pub/Sub → Socket.io → Real-time UI updates

---

### Tech Stack:

* Frontend: React, TailwindCSS, Socket.io-client
* Backend: Node.js, Express.js
* Queue System: BullMQ + Redis
* Database: MongoDB
* Real-time: Socket.io

# Deployment:

* Frontend → Vercel
* Backend → Render
* Worker → Railway
* Redis → Upstash

---

### Key Features:

✅ Asynchronous Job Processing
Jobs are added to a queue and processed independently by workers
Prevents blocking of main application thread

✅ Worker-Based Architecture
Dedicated worker service processes jobs concurrently
Scalable and production-ready design

✅ Real-Time Job Tracking
Live updates using Socket.io
Job states: pending → processing → completed / failed

✅ Rate Limiting & Backpressure
Handles high traffic gracefully
Returns 429 responses under overload to protect system stability

✅ Retry & Failure Handling
Automatic retries for failed jobs
Error logging and failure tracking

✅ Live Dashboard
Queue stats (waiting, active, completed, failed)
Activity feed for job events
Throughput monitoring (jobs/sec)

---

### Load Testing Results

Tested using k6 under simulated load:

* Throughput: ~38 requests/sec
* Success Rate: ~82%
* Throttled Requests (429): ~18%
* Avg Latency: ~968ms
* p95 Latency: ~1.65s
* Max Latency Spike: ~21s

* System demonstrates graceful degradation under high load using rate limiting and queue backpressure.

---

### Failure Simulation

* The system is designed to be resilient:

If worker is down:
* Jobs remain in pending state
* No system crash
* When worker restarts:
* Pending jobs are automatically processed

* Demonstrates decoupled architecture & fault tolerance

---

### Authentication

* JWT-based authentication
* Secure cookies (httpOnly, sameSite, secure in production)
* Protected API routes

---

### Project Structure

backend/
 ├── controllers/
 ├── routes/
 ├── workers/
 │    └── job.worker.js
 ├── queue/
 ├── models/
 ├── server.js

frontend/
 ├── components/
 ├── pages/
 ├── socket/
 ├── utils/
 ├── App.jsx

---

## Backend
* cd backend
* npm install
* npm run dev

## Worker
* npm run worker

## Frontend

* cd frontend
* npm install
* npm run dev

---

## 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* Worker deployed on Railway
* Redis hosted on Upstash

---

## 📈 What Makes This Project Stand Out

* Not a basic CRUD app — real distributed system
* Demonstrates queue-based architecture
* Includes load testing with metrics
* Implements real-time updates at scale
* Shows failure handling & system resilience
* Fully deployed across multiple services
