// validation
const Joi = require('@hapi/joi')
const registerationValidation = data => {
  var schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    mobile: Joi.number().min(11).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const loginValidation = data => {
  var schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

module.exports.registerationValidation = registerationValidation
module.exports.loginValidation = loginValidation
