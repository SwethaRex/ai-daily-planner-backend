const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log("token: ", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  // console.log("Data:", data);
  // console.log("Error:", error);
  if (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = data.user;

  console.log("Attached req.user:", req.user);
  next();
};
