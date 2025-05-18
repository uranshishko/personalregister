import { serve } from "@hono/node-server";
import { createApp } from "./app";

import { AppServiceRegistry } from "./services/service-registry";
import { EmployeeService } from "./services/employee-service";

const PORT = 3000;

const services = new AppServiceRegistry();
services.register(EmployeeService, new EmployeeService());

const app = createApp(services);

serve({ fetch: app.fetch, port: PORT });
console.log(`Server running on port ${PORT}`);
