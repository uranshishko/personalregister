import { z } from "@hono/zod-openapi";

export const formatZodIssue = (issue: z.ZodIssue): string => {
  return issue.message;
};

export const formatZodError = (error: z.ZodError): string => {
  const { issues } = error;

  if (issues.length > 0) {
    return formatZodIssue(issues[0]);
  }

  return "";
};
