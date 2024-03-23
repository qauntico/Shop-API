# Ticket Store Backend API

This Node.js application serves as the backend API for a ticket-selling store. It provides endpoints for managing tickets, orders, and users for the corresponding frontend application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)

## Introduction

The Ticket Store Backend API is built using Node.js and Express.js. It offers functionality to manage tickets, process orders, and handle user authentication and authorization. This API is designed to be used alongside a frontend application, providing seamless integration for managing and selling tickets.

## Features

- **Ticket Management**: CRUD operations for managing tickets.
- **Order Processing**: Endpoints to create, retrieve, update, and delete orders.
- **User Authentication**: Secure user authentication and authorization mechanisms.
- **Middleware**: Utilizes middleware for request validation, error handling, and authentication.
- **Scalability**: Built with scalability in mind to handle a large number of concurrent users.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Configure any necessary environment variables (if applicable).
5. Then use `nodemon app.js` to run serer it publishes by default on port 8000

## API Endpoints
You can fine api endpoints for this api in the router file. 

## Configuration
## Enviromental Virables Needed
1. ONLINEDB
2. PORT
3. SALTROUNDS
4. JWT_SECRET
   
