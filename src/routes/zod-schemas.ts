import { z } from "@hono/zod-openapi";

export const apiOKResponseSchema = z.object({
  success: z.literal(true).openapi({ example: true }),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false).openapi({ example: false }),
  error: z.string().openapi({ example: "Something went wrong" }),
});
