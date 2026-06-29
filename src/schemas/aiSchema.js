const { z } = require("zod");
const { createTaskSchema } = require('./taskSchema')

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const scheduleSchema = z.array(
  z.object({
    task: z.string(),
    start: z.string().datetime(),
    end: z.string().datetime(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    reason: z.string().optional(),
  }),
);

const generateScheduleSchema = z.object({
  tasks: z.array(createTaskSchema).min(1),
});

module.exports = {
  chatSchema,
  scheduleSchema,
  generateScheduleSchema,
};
