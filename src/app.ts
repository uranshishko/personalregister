import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";

import { AppServiceRegistry } from "./services/service-registry";
import { createEmployeeRoutes } from "./routes/employees";

export const createApp = (services: AppServiceRegistry) => {
  const app = new OpenAPIHono();

  app.use(logger());

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Employee Registry API",
    },
  });

  app.get("/ui", swaggerUI({ url: "/doc" }));
  app.route("/api", createEmployeeRoutes(services));

  return app;
};
