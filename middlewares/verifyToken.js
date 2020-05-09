const jwt = require('jsonwebtoken')
const jsonResponse = require('../jsonResponse')
module.exports = function (req, res, next) {
  const token = req.header('auth-token')
  if (!token) return res.status(401).json(jsonResponse([], 401, 'Unauthorized Access !!', true))
  else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
      next()
    } catch (error) {
      res.status(400).json(jsonResponse([], 400, 'Invalid Token !!', true))
    }
  }
}
