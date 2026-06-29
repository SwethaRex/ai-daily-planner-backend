module.exports = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);

    req.body = parsed; //clean + validated data
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.errors?.[0]?.message || "invalid request",
    });
  }
};
