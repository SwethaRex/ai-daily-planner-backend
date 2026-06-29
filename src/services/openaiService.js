const axios = require("axios");

// console.log(process.env.OPENROUTER_API_KEY);

exports.generatePlan = async (tasks) => {
  const prompt = `
    you are an intelligent daily planner.

    Create a realistic schedule between 9:00 and 18:00.

    Rules:
    - Prioritize High priority tasks
    - Consider deadlines
    - Use estimated_time if provided (in hours)
    - Add short breaks if needed
    - Do not overlap tasks

    Return ONLY valid JSON
    Include:
    - task
    - start
    - end
    - priority
    - reaon(why this task is scheduled at that time)

    [
        {"task": "Task name","priority": "....", "start":"HH:MM", "end":"HH:MM", "reason":"...."}
    ]

    Tasks:
    ${JSON.stringify(tasks)}
    `;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a smart task planner" },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content;
};

exports.generateChatResponse = async (message, tasks, schedule) => {
  const systemPrompt = `
  You are a smart and concise productivity assistant.

Tasks:
  ${JSON.stringify(tasks)}

  Today's schedule:
  ${JSON.stringify(schedule)}

  Instructions:
  - Use this data to answer user questions
  - Be direct and conversational
  - Keep the answer short and actionable
  - Avoid long explanations
  - Highlight key insight first
  - Give 1-2 practical suggestions
  `;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...message, //chat history + new message
      ],
      temperature: 0.5,
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "AI Daily Planner",
      },
    },
  );

  return response.data.choices[0].message.content;
};
