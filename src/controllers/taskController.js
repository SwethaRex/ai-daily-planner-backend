const supabase = require("../config/supabase");

//Test function
exports.testDB = async (req, res) => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
};

//Get all tasks
exports.getTasks = async (req, res) => {
  // console.log("req user=", req.user);
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", req.user.id);

  // console.log("Data:"s

  if (error) return res.status(500).json(error);
  res.json(data);
};

//Create task
exports.createTask = async (req, res) => {
  // console.log("Create task", req.body);
  const task = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: req.user.id }])
    .select();

  if (error) return res.status(500).json(error);
  return res.status(201).json(data[0]);
};

//Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("tasks")
    .update(req.body)
    .eq("user_id", req.user.id)
    .select();

  if (error) return res.status(500).json(error);
  return res.json(data);
};

//Delete task

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json(error);
  return res.json({ message: "Task deleted" });
};
