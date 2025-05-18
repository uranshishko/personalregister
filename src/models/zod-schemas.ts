import { z } from "@hono/zod-openapi";

export const employeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "firstName must be at least 3 characters long"),
  lastName: z
    .string()
    .trim()
    .min(3, "lastName must be at least 3 characters long"),
  email: z.string().trim().email(),
});
