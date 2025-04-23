# OOAD_Secure_Bank

# Bank Management System

A comprehensive bank management system built with Spring Boot, MySQL, and React. The system includes features for transaction management, loan management, fraud detection, and security management.

## Features

- User Authentication and Authorization
- Account Management
- Transaction Processing with Fraud Detection
- Loan Management
- Secure API with JWT
- Modern React Frontend

## Technology Stack

### Backend
- Java 11
- Spring Boot 2.7.0
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT Authentication
- Maven

### Frontend
- React 18
- Material-UI
- React Router
- Axios
- JWT Authentication

## Project Structure

```
bank-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── bank/
│   │   │   │           ├── config/
│   │   │   │           ├── controller/
│   │   │   │           ├── model/
│   │   │   │           ├── repository/
│   │   │   │           ├── security/
│   │   │   │           └── service/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Install Java 17 and Maven
2. Configure MySQL database
3. Update `application.properties` with your database credentials
4. Run the following commands:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

1. Install Node.js and npm
2. Run the following commands:
```bash
cd frontend
npm install
npm start
```



## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

