/**
 * Validation Middleware Factory
 * Creates a middleware that validates request body against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return next(error); // Will be caught by error handler middleware
        }

        // Replace req.body with validated & sanitized value
        req.body = value;
        next();
    };
};

module.exports = validate;
