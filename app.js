/* eslint "prefer-const": "off" */
/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()

const port = 8000

// import routes
const postRoutes = require('./routes/posts')
const setupRoutes = require('./routes/setup')
const authRoutes = require('./routes/authRoutes')

/*
    Middlewares
*/

// json body parser
app.use(express.json())
// handle form submission
app.use(express.urlencoded({ extended: false }))
// other routes
app.use('/api/user', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/setup', setupRoutes)

app.get('/', (req, res) => {
  res.send(' Welcome To NodeBlog Apis')
})

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`)
})
