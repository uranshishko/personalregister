# Employee Registry API

This is a REST API for managing an employee registry, built using **TypeScript** and the **Hono** framework. The application is structured using sound design principles such as separation of concerns, type safety, and OpenAPI documentation.

## Features

The API supports the following operations:

- [x] **Add a new employee**
- [x] **Remove an employee**
- [x] **Retrieve all employees**

---

## Technical Overview

### Language & Frameworks

- **TypeScript** – static typing and modern syntax.
- **Hono** – a minimal, fast web framework.
- **Zod** – for input validation.
- **OpenAPI/Swagger** – automatic API documentation.
- **async-mutex** – ensures safe concurrent access in the memory store.

### Architecture

The project is organized in clear layers:

- **Models** – type definitions (e.g, `Employee`).
- **Services** – business logic and in-memory data handling (e.g, `EmployeeService`).
- **Routing** – defines HTTP endpoints and logic.
- **ServiceRegistry** – simple dependency injection for modularity and testability.
- **Testing** – integration tests using `fetch` against a local test server.

The service layer (`EmployeeService`) handles all logic related to adding, retrieving, and removing employees, using a Map to store data in memory. A mutex is used to ensure thread safety during concurrent operations.

Since all data handling is encapsulated within the service layer, switching to a persistent storage solution (such as a database) in the future would require changes only in this layer — without affecting the rest of the application.

---

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`.

3. Open Swagger documentation:

   ```bash
   http://localhost:3000/ui
   ```

### API Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/api/employees`      | Add a new employee             |
| GET    | `/api/employees`      | Retrieve all employees         |
| DELETE | `/api/employees/{id}` | Delete an employee by their ID |

### Testing

To run tests, use the following command:

```bash
npm test
```

Tests include:

1. Creating an employee
2. Preventing duplicate employee creation
3. Retrieving employees
4. Deleting an employee
5. Creating multiple employees concurrently
