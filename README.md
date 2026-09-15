# Endangered Species Tracker

The Endangered Species Tracker is a full-stack MERN application that allows users to create, view, update, and delete endangered species records.

The application was created to demonstrate CRUD functionality using React, Node.js, Express, MongoDB, and Mongoose.

## Features

- View endangered species stored in MongoDB
- Add a new species
- Edit an existing species
- Delete a species
- Responsive custom conservation-themed interface
- React frontend connected to an Express REST API
- MongoDB Atlas cloud database
- Live deployment using Render

## Technologies Used

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express
- Mongoose
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

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/species` | Get all species |
| GET | `/api/species/:id` | Get one species |
| POST | `/api/species` | Create a species |
| PATCH | `/api/species/:id` | Update a species |
| DELETE | `/api/species/:id` | Delete a species |

## Pages

### Species Dashboard

The dashboard displays species stored in MongoDB. Users can edit or delete records directly from the dashboard.

### Add Species

The Add Species page contains a form for entering a species name, conservation status, and habitat. Submitting the form saves the new record to MongoDB.

## Local Installation

Clone the repository and install the backend dependencies:

```bash
npm install
```

Install the React client dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the root directory and add:

```text
MONGODB_URI=your_mongodb_connection_string
```

Start the backend from the project root:

```bash
npm run dev
```

Start the React development server from the client directory:

```bash
npm run dev
```

## Production Build

From the root directory:

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
Mobile Development