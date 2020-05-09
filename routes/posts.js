const express = require('express')
const router = express.Router()
const DB = require('../database')
const jsonResponse = require('../jsonResponse')
const verifyToken = require('../middlewares/verifyToken')

// get all posts
router.get('/', (req, res) => {
  DB.query('SELECT * FROM posts', (error, results, fields) => {
    if (error) throw error
    res.status(200).json(jsonResponse(results, 200))
  })
})

// get specific post
router.get('/:id', (req, res) => {
  var id = req.params.id
  DB.query('SELECT * FROM posts WHERE `id` =' + id, (error, results, fields) => {
    if (error) throw error
    if (results.length > 0) {
      res.status(200).json(jsonResponse(results[0], 200))
    } else {
      res.status(404).json(jsonResponse([], 404, 'Post Not Found !!', true))
    }
  })
})
// create post
router.post('/create', verifyToken, async (req, res) => {
  await DB.query('SELECT * FROM users WHERE `email` = "' + req.user.email + '"',
    async (error, results, fields) => {
      if (error) throw error
      else {
        var post = req.body
        if (results.length > 0) {
          var userId = results[0].id
          post.created_at = new Date()
          post.user_id = userId
          await DB.query('INSERT INTO posts SET ?', post, (error, results, fields) => {
            if (error) throw error
            else {
              res.status(200).json(jsonResponse(post, 200, 'Post Created Successfully'))
            }
          })
        }
      }
    })
})

// edit post
router.post('/edit/:id', verifyToken, async (req, res) => {
  var id = req.params.id

  await DB.query('SELECT * FROM users WHERE `email` = "' + req.user.email + '"',
    async (error, results, fields) => {
      if (error) throw error
      else {
        if (results.length > 0) {
          var userId = results[0].id
          DB.query('SELECT * FROM posts WHERE `id` =' + id, async (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
              if (results[0].user_id === userId) {
                var post = req.body
                DB.query('UPDATE posts SET ? WHERE `id` = ' + id, post, (error, results, fields) => {
                  if (error) throw error
                  else {
                    res.status(200).json(jsonResponse(post, 200, 'Post Updated Successfully'))
                  }
                })
              } else {
                res.status(401).json(jsonResponse([], 401, 'Unauthorized Access !!', true))
              }
            } else {
              res.status(404).json(jsonResponse([], 404, 'Post Not Found !!', true))
            }
          })
        }
      }
    })
})
// delete post
router.get('/delete/:id', verifyToken, async (req, res) => {
  var id = req.params.id

  await DB.query('SELECT * FROM users WHERE `email` = "' + req.user.email + '"',
    async (error, results, fields) => {
      if (error) throw error
      else {
        if (results.length > 0) {
          var userId = results[0].id
          DB.query('SELECT * FROM posts WHERE `id` =' + id, async (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
              if (results[0].user_id === userId) {
                DB.query('DELETE FROM posts WHERE `id` =' + id, async (error, results, fields) => {
                  if (error) throw error
                  else {
                    if (results.affectedRows > 0) {
                      res.status(200).json(jsonResponse([], 200, 'Post Deleted Successfully'))
                    } else {
                      res.status(404).json(jsonResponse([], 404, 'Post Not Found !!', true))
                    }
                  }
                })
              } else {
                res.status(401).json(jsonResponse([], 401, 'Unauthorized Access !!', true))
              }
            } else {
              res.status(404).json(jsonResponse([], 404, 'Post Not Found !!', true))
            }
          })
        }
      }
    })
})

module.exports = router
