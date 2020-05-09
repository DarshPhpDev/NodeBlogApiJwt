const express = require('express')
const router = express.Router()
const DB = require('../database')
var sql = ''
router.get('/table', (req, res) => {
  sql = 'CREATE TABLE users ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `mobile` VARCHAR(255) NULL , `password` VARCHAR(255) NOT NULL , `created_at` DATETIME NULL , PRIMARY KEY (`id`))'
  DB.query(sql, (error, results) => {
    if (error) throw error
    else res.send('Users Table Created')
  })
  sql = 'CREATE TABLE posts ( `id` INT NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL , `body` TEXT NOT NULL ,`user_id` INT NULL ,`created_at` DATETIME NULL, PRIMARY KEY (`id`))'
  DB.query(sql, (error, results) => {
    if (error) throw error
    else res.send('Posts Table Created')
  })
  sql = 'ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
  DB.query(sql, (error, results) => {
    if (error) throw error
    else res.send('Posts >> User Relation Created')
  })
})

router.get('/db', (req, res) => {
  sql = 'CREATE DATABASE nodeBlog'
  DB.query(sql, (error, results) => {
    if (error) throw error
    res.send(results)
  })
})

module.exports = router
