exports.ensureObject = (obj) => {
  if (typeof obj !== "object" || !obj) return {};
  return obj;
};
