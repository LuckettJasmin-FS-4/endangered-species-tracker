# Endangered Species Tracker

The Endangered Species Tracker is a full-stack MERN application that allows users to create, view, update, and delete endangered species records.

The application was created to demonstrate CRUD functionality using React, Node.js, Express, MongoDB, and Mongoose. It also includes a React Native application built with Expo that uses the existing REST API.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- View endangered species stored in MongoDB
- Add a new species
- Edit an existing species
- Delete a species
- Responsive custom conservation-themed interface
- React frontend connected to an Express REST API
- React Native client built with Expo
- MongoDB Atlas cloud database
- Live deployment using Render

## Technologies Used

### Web Frontend

- React
- Vite
- React Router
- Axios
- CSS

### React Native Client

- React Native
- Expo
- JavaScript
- Fetch API
- Expo SecureStore

### Backend

- Node.js
- Express
- Mongoose
- bcryptjs
- JSON Web Token
- CORS
- dotenv

### Database

- MongoDB Atlas

### Deployment

- Render
- GitHub

## Species Model

Each species record contains:

- `name` - Species name
- `status` - Conservation status
- `habitat` - Primary habitat
- `created_at` - Date the record was created

## Authentication

Users can register and log in through the API. Passwords are hashed with bcrypt and successful authentication returns a JSON Web Token (JWT). The React Native client sends the JWT with protected API requests. Unauthenticated requests to the Species API return a 401 response.

### Authentication Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |

## Protected API Routes

All Species routes require a valid Bearer token.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/species` | Get all species |
| GET | `/api/species/:id` | Get one species |
| POST | `/api/species` | Create a species |
| PATCH | `/api/species/:id` | Update a species |
| DELETE | `/api/species/:id` | Delete a species |

## Web Application

### Species Dashboard

The dashboard displays species stored in MongoDB. Users can edit or delete records directly from the dashboard.

### Add Species

The Add Species page contains a form for entering a species name, conservation status, and habitat. Submitting the form saves the new record to MongoDB.

## React Native Application

This project also includes a React Native application built with Expo. The React Native client supplements the MERN web application and provides the same core endangered species management workflow.

The React Native application allows users to:

- View endangered species records
- Add a new species
- Edit an existing species
- Delete a species
- Connect to the existing Express and MongoDB API

The React Native application is located in the `mobile` directory.

## Local Installation

Clone the repository and install the backend dependencies:

```bash
npm install
```

Install the React web client dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the root directory and add:

```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Run the Web Application

Start the backend from the project root:

```bash
npm run dev
```

Start the React development server from the `client` directory:

```bash
cd client
npm run dev
```

## Run the React Native Application

From the project root, enter the `mobile` directory:

```bash
cd mobile
```

Install the dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

To run the web version of the Expo application:

```bash
npm run web
```

## Production Build

From the project root:

```bash
npm run build
```

Start the production server:

```bash
NODE_ENV=production npm start
```

## Security

Environment variables and `node_modules` are excluded from Git using `.gitignore`. Database credentials are not stored in the repository.

## Author

Jasmin Luckett

Full Sail University  
Web Development