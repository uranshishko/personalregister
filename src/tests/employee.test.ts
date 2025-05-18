import { serve, ServerType } from "@hono/node-server";
import { createApp } from "../app";

import { AppServiceRegistry } from "../services/service-registry";
import { EmployeeService } from "../services/employee-service";

let server: ServerType | null = null;

/**
 * Start the server before running tests,
 * using an isolated service registry and app instance.
 */
beforeAll(async () => {
  const services = new AppServiceRegistry();
  services.register(EmployeeService, new EmployeeService());

  const app = createApp(services);

  server = serve({ fetch: app.fetch, port: 4000 });
});

/** Close the server once all tests complete. */
afterAll(() => {
  if (!server) return;
  server.close();
});

describe("Employee Registry API", () => {
  // Will store the ID of the employee created for use in subsequent tests
  let id: string = "<empty>";

  const testEmployee = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  /** Test adding a new employee */
  it("should add an employee", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testEmployee),
    });

    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.data.email).toBe(testEmployee.email);

    // Save employee ID for later use
    id = data.data.id;
  });

  /** Test rejection of adding a duplicate employee by email */
  it("should not add an employee with duplicate email", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testEmployee),
    });

    expect(res.status).toBe(409);
  });

  /** Test retrieving all employees */
  it("should get all employees", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "GET",
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.data.length).toBe(1);
  });

  /** Test removing an employee by ID */
  it("should remove an employee", async () => {
    const res = await fetch(`http://localhost:4000/api/employees/${id}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
  });

  /** Test rejection of adding an employee with missing fields */
  it("should reject request with missing fields", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "John" }), // missing lastName and email
    });

    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  /** Test rejection of adding an employee with invalid email format */
  it("should reject invalid email format", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
      }),
    });

    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
  });

  /** Test rejection of adding an employee with too short names */
  it("should reject too short names", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Jo",
        lastName: "D",
        email: "john.doe@example.com",
      }),
    });

    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
  });

  /** Test rejection of adding an employee with extra fields */
  it("should ignore or reject extra fields", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Frank",
        lastName: "Doe",
        email: "frank.doe@example.com",
        role: "admin", // <-- extra field ❌
      }),
    });

    expect(res.status).toBe(400);
  });

  /** Test deleting a non-existent employee */
  it("should return 404 for non-existent employee ID", async () => {
    const res = await fetch(
      "http://localhost:4000/api/employees/non-existent-id",
      {
        method: "DELETE",
      },
    );

    expect(res.status).toBe(404);
  });

  /** Test response format */
  it("should return expected keys on success", async () => {
    const res = await fetch("http://localhost:4000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Frank",
        lastName: "Doe",
        email: "frank.doe@example.com",
      }),
    });

    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("id");
    expect(data.data).toHaveProperty("email", "frank.doe@example.com");
    expect(data.data).toHaveProperty("firstName", "Frank");
    expect(data.data).toHaveProperty("lastName", "Doe");
  });

  /** Test concurrency */
  it("should prevent duplicates even under concurrent requests", async () => {
    const payload = {
      firstName: "Concurrent",
      lastName: "Test",
      email: "concurrent@example.com",
    };

    const requests = Array(5)
      .fill(null)
      .map(() =>
        fetch("http://localhost:4000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

    const results = await Promise.all(requests);
    const created = results.filter((r) => r.status === 201);
    const conflicts = results.filter((r) => r.status === 409);

    expect(created.length).toBe(1);
    expect(conflicts.length).toBeGreaterThan(0);
  });
});
