import { OpenAPIHono } from "@hono/zod-openapi";
import { v4 as uuidv4 } from "uuid";

import { AppServiceRegistry } from "../../services/service-registry";
import { EmployeeService } from "../../services/employee-service";
import {
  addEmployeeRoute,
  deleteEmployeeRoute,
  getAllEmployeesRoute,
} from "./route-definitions";
import { employeeSchema } from "../../models/zod-schemas";
import { formatZodError } from "../../utils/error-formatter";

export const createEmployeeRoutes = (services: AppServiceRegistry) => {
  const router = new OpenAPIHono();

  const employeeService = services.get(EmployeeService);

  router.openapi(
    addEmployeeRoute,
    async (c) => {
      const body = await c.req.json();

      const parseResult = employeeSchema.strict().safeParse(body);
      if (!parseResult.success) {
        return c.json(
          { success: false, error: parseResult.error.message } as const,
          400,
        );
      }

      const id = uuidv4();
      const { firstName, lastName, email } = parseResult.data;
      const employee = await employeeService.add({
        id,
        firstName,
        lastName,
        email,
      });

      if (!employee) {
        return c.json(
          { success: false, error: "employee already exists" } as const,
          409,
        );
      }

      return c.json({ success: true, data: employee } as const, 201);
    },
    (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: false,
            error: formatZodError(result.error),
          } as const,
          400,
        );
      }
    },
  );

  router.openapi(getAllEmployeesRoute, async (c) => {
    const employees = await employeeService.getAll();
    return c.json({ success: true, data: employees } as const, 200);
  });

  router.openapi(deleteEmployeeRoute, async (c) => {
    const id = c.req.param("id");
    const isRemoved = await employeeService.remove(id);
    return isRemoved
      ? c.json({ success: true } as const, 200)
      : c.json({ success: false, error: "employee not found" } as const, 404);
  });

  return router;
};
