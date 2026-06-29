const { response } = require("express");
const supabase = require("../config/supabase");
const {
  generatePlan,
  generateChatResponse,
} = require("../services/openaiService");

exports.planDay = async (req, res) => {
  try {
    //1. fetch
    // console.log("plan day reached");
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", req.user.id);
    // console.log("Data processed", tasks);
    if (error) throw error;
    if (!tasks || tasks.length === 0) {
      return res.json({ plan: [], message: "No tasks found" });
    }

    // 2. Call OpenAI
    const aiResponse = await generatePlan(tasks);
    // console.log("AI response", aiResponse);
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    // 3. Try parsing JSON safely
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(cleanedResponse);
    } catch (e) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        raw: aiResponse,
      });
    }

    // save to database
    await supabase
      .from("schedules")
      .insert([
        {
          user_id: req.user.id,
          date: new Date().toISOString().split("T")[0],
          schedule_json: parsedPlan,
        },
      ])
      .select();

    // Return structured plan
    res.json({ plan: parsedPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allSchedules = async (req, res) => {
  const { data, error } = await supabase.from("schedules").select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    //1. Fetch tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select()
      .eq("user_id", userId);

    //2. Fetch today's schedule
    const today = new Date().toISOString().split("T")[0];

    const { data: schedules } = await supabase
      .from("schedules")
      .select()
      .eq("user_id", userId)
      .eq("date", today)
      .order("created_at", { ascending: false })
      .limit(1);

    const latestSchedule = schedules?.[0]?.schedule_json || [];

    //Get chat history - last 10 messages
    const { data: history } = await supabase
      .from("chat_history")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(10);

    //convert to openAi format
    const messages = history.map((msg) => ({
      role: msg.role,
      content: msg.message,
    }));
    //add current user message
    messages.push({ role: "user", content: message });

    // call AI with full context
    const aiResponse = await generateChatResponse(
      messages,
      tasks,
      latestSchedule,
    );

    // save user message and ai response
    await supabase.from("chat_history").insert([
      {
        user_id: userId,
        role: "user",
        message,
      },
      {
        user_id: userId,
        role: "assistant",
        message: aiResponse,
      },
    ]);

    // save AI response
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
