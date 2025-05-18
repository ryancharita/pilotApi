const validateBody = (schema) => (req, res, next) => {
  try {
    req.validatedBody = schema.parse(req.body);
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err.errors.map((e) => ({ field: e.path[0], message: e.message })),
    });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    req.validatedQuery = schema.parse(req.query);
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err.errors.map((e) => ({ field: e.path[0], message: e.message })),
    });
  }
};

module.exports = { validateBody, validateQuery };
