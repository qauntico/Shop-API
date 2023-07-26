const { body, validationResult } = require('express-validator');


const validation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
  ]



module.exports = {
  validation,
};