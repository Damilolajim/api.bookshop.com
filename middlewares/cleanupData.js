const cleanupData = (req, resp, next) => {
  const data = req.body;

  if (typeof data !== "object" || data === null) return data;

  const entries = Object.entries(data)
    .filter(([key, value]) => key.trim() !== "" && value != null)
    .map(([key, value]) => {
      if (typeof value !== "string") return [key, value];

      const trimmedValue = value.trim();
      return [key, key === "email" ? trimmedValue.toLowerCase() : trimmedValue];
    });

  req.body = Object.fromEntries(entries);
  next();
};

module.exports = cleanupData;
