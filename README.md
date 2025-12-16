# Voltera – Second-hand EV & Battery Trading Platform

## Abstract

Voltera-Web-App is a web-based system developed as a **course assignment**, aiming to demonstrate the design and implementation of a second-hand electric vehicle (EV) and battery trading platform. The project focuses on secure authentication, controlled listing management, and transparent transaction handling using modern full-stack web technologies.

---

## System Overview

* **Frontend**: React (Single Page Application)
* **Backend**: Java Spring Boot (RESTful API)
* **Database**: PostgreSQL
* **Cache**: Redis
* **ORM**: Spring Data JPA (Hibernate)
* **Storage**: AWS S3
* **Payment**: VNPAY (Sandbox)
* **Email**: SMTP (OTP & notifications)
* **Deployment**: Railway

---

## Technology Stack

* **Backend**: Java JDK 24, Spring Boot, Spring Security, JWT, JPA
* **Frontend**: React, Node.js v22.20.0
* **Infrastructure**: PostgreSQL, Redis, AWS S3

---

## How to Run

### Prerequisites

* Java JDK 24
* Node.js v22.20.0
* PostgreSQL
* Redis

### Setup

```bash
git clone https://github.com/HAIANH29/Voltera-Web-App.git
cd Voltera-Web-App
```

**Backend**

```bash
mvnw spring-boot:run
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

---

## Key Features

### User & Security

* Login / Logout
* JWT (Access & Refresh Token)
* Email verification with OTP
* Account approval, lock & unlock
* Profile management & avatar upload

### Listings

* Create EV & Battery listings
* Image upload (AWS S3)
* Listing approval & spam filtering
* Advanced search & filtering
* Favorite & comparison features

### Transactions

* Online payment (VNPAY Sandbox)
* Electronic contract signing (OTP / Email)
* Transaction & contract tracking
* Refund & fee management

### Management & Reports

* Complaint handling
* Transaction & revenue statistics