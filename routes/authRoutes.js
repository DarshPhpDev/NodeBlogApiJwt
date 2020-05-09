/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const DB = require('../database')
const jsonResponse = require('../jsonResponse')
const { registerationValidation, loginValidation } = require('../validations/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// register
router.post('/register', async (req, res) => {
  const { error } = registerationValidation(req.body)
  if (error) {
    res.status(200).json(jsonResponse([], 200, 'validation_error', true, error.details[0]))
  } else {
    var user = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password
    }
    try {
      // check user uniqueness
      DB.query('SELECT * FROM users WHERE `email` = "' + user.email + '"', async (error, results, fields) => {
        if (error) throw error
        else {
          if (results.length > 0) res.status(200).json(jsonResponse([], 200, 'Email Already taken !!'))
          else {
            user.created_at = new Date()
            // hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPass
            DB.query('INSERT INTO users SET ?', user, (error, results, fields) => {
              if (error) throw error
              else {
                delete user.password
                res.status(200).json(jsonResponse(user, 200, 'Account created successfully'))
              }
            })
          }
        }
      })
    } catch (error) {
      res.status(500).json(jsonResponse([], 500))
    }
  }
})

// login
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) {
    res.status(200).json(jsonResponse([], 200, 'validation_error', true, error.details[0]))
  } else {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    try {
      // check login cridentials
      DB.query('SELECT * FROM users WHERE `email` = "' + req.body.email + '"',
        async (error, results, fields) => {
          if (error) throw error
          else {
            if (results.length === 0) { res.status(200).json(jsonResponse([], 200, 'Email not found!', true)); res.end() } else {
              var user = results[0]
              const validPass = await bcrypt.compare(req.body.password, user.password)
              if (validPass) {
                delete user.password
                // create token
                // const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET)
                // 1 minute valid token
                const token = jwt.sign({
                  exp: Math.floor(Date.now() / 1000) + (60 * 1),
                  email: user.email
                }, process.env.TOKEN_SECRET)

                // res.header('auth-token', token).send(token)
                res.status(200).json(jsonResponse({ user, token }, 200))
              } else {
                res.status(200).json(jsonResponse([], 200, 'Invalid email or password', true))
              }
            }
          }
        })
    } catch (error) {
      res.status(500).json(jsonResponse([], 500))
    }
  }
})

module.exports = router
