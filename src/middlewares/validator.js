const Validation = (field) => {
  return (req, res, next) => {
    const keys = Object.keys(field.describe().keys);
    const errors = [];
    for (const key of keys) {
      const toCheck = field.extract(key);
      const { error, value } = toCheck.validate(req[key], {
        abortEarly: false,
      });
      
      if (error) {
        error.details.forEach(({ path, message }) => {
          errors.push({
            field: path[0],
            message,
          });
        });
      }
    }
    if (errors.length) {
      return res.status(400).json({
        message: 'Validation Error',
        errors,
      });
    }

    next();
  };
};
export default Validation;
