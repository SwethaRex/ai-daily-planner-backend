const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional(),

  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: z
    .string()
    .datetime()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),

  estimated_time: z.coerce
    .number()
    .positive("Estimated time must be positive")
    .optional(),
});

const updateTaskSchema = createTaskSchema.partial();

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
