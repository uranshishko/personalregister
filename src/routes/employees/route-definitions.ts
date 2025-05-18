import { createRoute, z } from "@hono/zod-openapi";

import { employeeSchema } from "../../models/zod-schemas";
import { apiOKResponseSchema, apiErrorResponseSchema } from "../zod-schemas";

export const addEmployeeRoute = createRoute({
  method: "post",
  path: "/employees",
  description: "Add a new employee",
  request: {
    body: {
      content: {
        "application/json": {
          schema: employeeSchema.strict(),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Employee added successfully",
      content: {
        "application/json": {
          schema: apiOKResponseSchema.extend({
            data: employeeSchema.extend({
              id: z.string(),
            }),
          }),
        },
      },
    },
    400: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Employee already exists",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema,
        },
      },
    },
  },
});

export const getAllEmployeesRoute = createRoute({
  method: "get",
  path: "/employees",
  description: "Get all employees",
  responses: {
    200: {
      description: "List of all employees",
      content: {
        "application/json": {
          schema: apiOKResponseSchema.extend({
            data: z.array(
              employeeSchema.extend({
                id: z.string(),
              }),
            ),
          }),
        },
      },
    },
  },
});

export const deleteEmployeeRoute = createRoute({
  method: "delete",
  path: "/employees/{id}",
  description: "Delete an employee",
  request: {
    params: z.object({
      id: z
        .string()
        .min(3)
        .openapi({
          param: {
            name: "id",
            in: "path",
          },
        }),
    }),
  },
  responses: {
    200: {
      description: "Employee deleted successfully",
      content: {
        "application/json": {
          schema: apiOKResponseSchema,
        },
      },
    },
    404: {
      description: "Employee not found",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema,
        },
      },
    },
  },
});
